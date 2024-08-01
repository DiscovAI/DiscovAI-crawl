import { Request, Response } from "express";
import { Page } from "playwright";
import z from "zod";
import { getError } from "../lib/browser/get-error";
import {
  PROXY_SERVER,
  browser,
  context,
  initializeBrowser,
} from "../lib/browser/playwright";
import { readabilityCleaner } from "../lib/html-cleaner";
import { htmlToMarkdown } from "../lib/html-to-md";
import { uploadImage } from "../lib/image-upload";
import { isValidUrl } from "../lib/utils";
import {
  extractFromContent,
  seoWriterFromContent,
} from "../service/llm-extract";
import { getPageMetaData, scrapePage } from "../service/scrape";
import { validateRequest } from "../middleware/zod";
import { embededDoc } from "../service/embedding";

export const ScrapeSchema = z.object({
  url: z.string().url("Invalid URL"),
  wait_after_load: z.number().optional(),
  timeout: z.number().optional(),
  headers: z.record(z.string()).optional(),
  check_selector: z.string().optional(),
  need_screenshot: z.boolean().optional(),
  need_embedding: z.boolean().optional(),
  llm_extract: z.boolean().optional(),
  llm_detail: z.boolean().optional(),
});

type ScrapeModel = z.infer<typeof ScrapeSchema>;

export const scrapeMiddlware = validateRequest(ScrapeSchema);

export const scrapeController = async (req: Request, res: Response) => {
  const validatedData = ScrapeSchema.parse(req.body);
  const {
    url,
    wait_after_load = 0,
    timeout = 15000,
    headers,
    check_selector,
    need_screenshot = false,
    need_embedding = false,
    llm_extract = false,
    llm_detail = false,
  } = validatedData;

  console.log(`================= Scrape Request =================`);
  console.log(`URL: ${url}`);
  console.log(`Wait After Load: ${wait_after_load}`);
  console.log(`Timeout: ${timeout}`);
  console.log(`Headers: ${headers ? JSON.stringify(headers) : "None"}`);
  console.log(`Check Selector: ${check_selector ? check_selector : "None"}`);
  console.log(`==================================================`);

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  if (!PROXY_SERVER) {
    console.warn(
      "⚠️ WARNING: No proxy server provided. Your IP address may be blocked."
    );
  }

  if (!browser || !context) {
    await initializeBrowser();
  }

  const page = await context.newPage();

  // Set headers if provided
  if (headers) {
    await page.setExtraHTTPHeaders(headers);
  }

  let pageContent;
  let pageStatusCode: number | null = null;
  try {
    // Strategy 1: Normal
    console.log("Attempting strategy 1: Normal load");
    const result = await scrapePage(
      page,
      url,
      "load",
      wait_after_load,
      timeout,
      check_selector
    );
    pageContent = result.content;
    pageStatusCode = result.status;
  } catch (error) {
    console.error(error);
    console.log(
      "Strategy 1 failed, attempting strategy 2: Wait until networkidle"
    );
    try {
      // Strategy 2: Wait until networkidle
      const result = await scrapePage(
        page,
        url,
        "networkidle",
        wait_after_load,
        timeout,
        check_selector
      );
      pageContent = result.content;
      pageStatusCode = result.status;
    } catch (finalError) {
      await page.close();
      return res
        .status(500)
        .json({ error: "An error occurred while fetching the page." });
    }
  }

  const pageError = pageStatusCode !== 200 ? getError(pageStatusCode) : false;

  if (pageError) {
    console.log(
      `🚨 Scrape failed with status code: ${pageStatusCode} ${pageError}`
    );
    await page.close();
    return res.json({
      pageStatusCode,
      pageError,
    });
  }
  console.log(`✅ Scrape successful!`);

  const cleanDocument = readabilityCleaner(pageContent, url);
  let markdown = htmlToMarkdown(cleanDocument?.cleanHtml || pageContent);
  let textContent =
    cleanDocument?.textContent ||
    (await page.textContent("body")).replaceAll(/[\n\t]/g, "").trim();

  const metadata = await getPageMetaData(page);

  const asyncTasks = [];

  if (need_screenshot) {
    console.log(`Task: take screenshot`);
    asyncTasks.push(
      (async () => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        return {
          name: "screenshot",
          data: await uploadImage(await page.screenshot({ type: "png" })),
        };
      })()
    );
  }
  if (llm_extract) {
    console.log(`Task: llm extract content`);
    asyncTasks.push(
      (async () => ({
        name: "llm_extract",
        data: await extractFromContent({ content: textContent }),
      }))()
    );
  }
  if (llm_detail) {
    console.log(`Task: llm generate markdown`);
    asyncTasks.push(
      (async () => ({
        name: "llm_detail",
        data: await seoWriterFromContent({ content: textContent }),
      }))()
    );
  }

  const result = await Promise.all(asyncTasks);
  const screeshotUrl = result.find((r) => r.name === "screenshot")?.data;
  const extractData = result.find((r) => r.name === "llm_extract")?.data;
  const detailData = result.find((r) => r.name === "llm_detail")?.data;

  let embeddings;
  if (need_embedding && (llm_extract || llm_detail)) {
    console.log(`Task: generate embeddings`);
    let content = detailData
      ? detailData
      : extractData?.type === "success"
      ? JSON.stringify(extractData.data)
      : textContent;
    embeddings = await embededDoc({
      content,
      metadata: { url: metadata.url, title: metadata.title, type: "markdown" },
    });
  }

  return res.json({
    pageStatusCode,
    pageError,
    metadata,
    content: {
      markdown,
      textContent,
    },
    media: {
      screeshotUrl,
    },
    llm_output: {
      extractData,
      detailData,
    },
    embeddings,
  });
};
