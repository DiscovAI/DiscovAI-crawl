import {
  JSONParseError,
  TypeValidationError,
  generateObject,
  generateText,
} from "ai";
import z from "zod";
import { ExtractPrompt, SEOWriterPrompt } from "../helpers/prompt";
import { openai } from "../lib/llm-provider";
import { generateMarkdownFromJson } from "../helpers/schema-json-to-md";

const model = openai("gpt-4o-mini");

export const defaultExtractSchema = z.object({
  webpage: z.object({
    title: z.string(),
    summary: z.string(),
    keywords: z.array(z.string()),
    howToUse: z.string().optional(),
    features: z.array(
      z.object({
        title: z.string(),
        detail: z.string(),
      })
    ),
    faq: z.array(z.object({ q: z.string(), a: z.string() })),
    helpfulTips: z.array(z.string()),
    testimonials: z.array(z.string()).optional(),
    callToAction: z.array(z.string()).optional(),
  }),
});

type DefaultExtractedData = z.infer<typeof defaultExtractSchema>;
type AnyExtractData = z.AnyZodObject;

interface ExtractParams {
  content: string;
  schema?: z.AnyZodObject;
  prompt?: string;
  image?: string; // extract from image is ok for gpt-4o
}

export async function extractFromContent({
  content,
  schema,
  prompt,
}: ExtractParams): Promise<
  | {
      type: "success";
      data: DefaultExtractedData | AnyExtractData;
      markdown: string;
    }
  | { type: "parse-error"; text: string }
  | { type: "validation-error"; value: unknown }
  | { type: "unknown-error"; error: unknown }
> {
  let _schema = schema || defaultExtractSchema;
  let _prompt = prompt || ExtractPrompt;
  try {
    const result = await generateObject({
      model,
      schema: _schema,
      system: _prompt,
      prompt: content,
    });
    const markdown = generateMarkdownFromJson(result.object);
    return { type: "success", data: result.object, markdown };
  } catch (error) {
    if (TypeValidationError.isTypeValidationError(error)) {
      return { type: "validation-error", value: error.value };
    } else if (JSONParseError.isJSONParseError(error)) {
      return { type: "parse-error", text: error.text };
    } else {
      return { type: "unknown-error", error };
    }
  }
}

export async function seoWriterFromContent({ content }): Promise<string> {
  try {
    const result = await generateText({
      model,
      prompt: SEOWriterPrompt(content),
      maxTokens: 6000,
    });
    return result.text;
  } catch (error) {}
}
