import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embed, embedMany } from "ai";
import { openai } from "../lib/llm-provider";

const config = {
  chunkSize: 3000,
  chunkOverlap: 100,
};

async function markdownSplitter(content: string, appendInfo?: any) {
  const splitter = RecursiveCharacterTextSplitter.fromLanguage(
    "markdown",
    config
  );
  return await splitter.splitText(content);
}

async function textSplitter(content: string, appendInfo?: any) {
  const splitter = new RecursiveCharacterTextSplitter(config);
  return await splitter.splitText(content);
}

export async function embedQuery(query: string) {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: query,
  });
  return embedding;
}

interface EmbeddingDoc {
  metadata: {
    url: string;
    title: string;
    type: "text" | "markdown";
  };
  content: string;
}

export async function embededDoc({ metadata, content }: EmbeddingDoc) {
  let splitter = metadata.type === "markdown" ? markdownSplitter : textSplitter;
  const textChunk = await splitter(content);
  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: textChunk,
  });
  return textChunk.map((t, i) => ({
    chunk: t,
    embedding: embeddings[i],
  }));
}
