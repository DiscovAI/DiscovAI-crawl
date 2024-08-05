import { Readability, isProbablyReaderable } from "@mozilla/readability";
import { JSDOM, VirtualConsole } from "jsdom";

// disable jsdom directly output error to console
const virtualConsole = new VirtualConsole();

virtualConsole.on("error", () => {
  console.error("some error");
});
virtualConsole.on("jsdomError", () => {
  console.error("jsdom error");
});

interface CleanDocument {
  title: string;
  cleanHtml: string; // clean html
  description?: string;
  textContent?: string; // only text, sometimes better than markdown
}

export const readabilityCleaner = (
  html: string,
  url: string
): CleanDocument | null => {
  let result: CleanDocument | null = null;

  try {
    const doc = new JSDOM(html, { url, virtualConsole });
    const dom = doc?.window?.document;
    if (dom) {
      const article = new Readability(dom).parse();
      result = {
        title: article.title,
        description: article.excerpt,
        cleanHtml: article.content,
        textContent: article.textContent.replaceAll(/[\n\t]/g, "").trim(),
      };
    }
  } catch (error) {
    console.error(error);
  } finally {
    return result;
  }
};
