import { Page } from "playwright";

export const scrapePage = async (
  page: Page,
  url: string,
  waitUntil: "load" | "networkidle",
  waitAfterLoad: number,
  timeout: number,
  checkSelector: string | undefined
) => {
  console.log(
    `Navigating to ${url} with waitUntil: ${waitUntil} and timeout: ${timeout}ms`
  );
  const response = await page.goto(url, { waitUntil, timeout });

  if (waitAfterLoad > 0) {
    await page.waitForTimeout(waitAfterLoad);
  }

  if (checkSelector) {
    try {
      await page.waitForSelector(checkSelector, { timeout });
    } catch (error) {
      throw new Error("Required selector not found");
    }
  }

  return {
    content: await page.content(),
    status: response ? response.status() : null,
  };
};

interface PageMetaData {
  url: string;
  title: string;
  description: string;
  keywords: string;
  lang: string;
}

export async function getPageMetaData(page: Page): Promise<PageMetaData> {
  return {
    url: page.url(),
    title: await page.title(),
    description: await page.evaluate(() => {
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      return metaDescription
        ? (metaDescription as HTMLMetaElement).content
        : "";
    }),
    keywords: await page.evaluate(() => {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      return metaKeywords ? (metaKeywords as HTMLMetaElement).content : "";
    }),
    lang: await page.evaluate(() => {
      return document.documentElement.lang || "en"; // default 'en'
    }),
  };
}
