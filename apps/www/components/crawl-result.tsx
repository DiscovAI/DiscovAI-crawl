import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { FiFileText, FiImage, FiCpu, FiDatabase } from "react-icons/fi";
import { MemoizedReactMarkdown } from "./markdown";

type ResultData = {
  pageMetadata: {
    title: string;
    description: string;
    keywords: string;
    language: string;
  };
  media?: {
    screenshotUrl: string;
  };
  llmOutput?: {
    markdown: string;
    json: object;
  };
  embedding?: {
    embeddingNumbers: number[];
    chunkText: string[];
  };
};

interface ResultPreviewProps {
  data: ResultData;
}

const CrawlResultPreview: React.FC<ResultPreviewProps> = ({ data }) => {
  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Scraping Result Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="json">Raw JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="json">
            <ScrollArea className="h-[1000px] w-full rounded-md border p-4">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="preview">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>
                    <FiImage className="inline mr-2" />
                    Screenshot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    src={data.media.screenshotUrl}
                    alt="Screenshot"
                    width={800}
                    height={400}
                    className="rounded-xl"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <FiFileText className="inline mr-2" />
                    Page Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Title:</strong> {data.pageMetadata.title}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {data.pageMetadata.description}
                  </p>
                  <p>
                    <strong>Keywords:</strong> {data.pageMetadata.keywords}
                  </p>
                  <p>
                    <strong>Language:</strong> {data.pageMetadata.language}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    <FiCpu className="inline mr-2" />
                    LLM Output
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="markdown(preview)">
                    <TabsList>
                      <TabsTrigger value="markdown(preview)">
                        Preview
                      </TabsTrigger>
                      <TabsTrigger value="markdown(text)">Markdown</TabsTrigger>
                      <TabsTrigger value="json">JSON</TabsTrigger>
                    </TabsList>
                    <TabsContent value="markdown(preview)">
                      <ScrollArea className="h-[1000px] w-full rounded-md border p-4">
                        <MemoizedReactMarkdown className="prose dark:prose-invert inline leading-normal break-words">
                          {data.llmOutput.markdown}
                        </MemoizedReactMarkdown>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="markdown(text)">
                      <ScrollArea className="h-[1000px] w-full rounded-md border p-4">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: data.llmOutput.markdown,
                          }}
                        />
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="json">
                      <ScrollArea className="h-[1000px] w-full rounded-md border p-4">
                        <pre>
                          {JSON.stringify(data.llmOutput.json, null, 2)}
                        </pre>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {data?.embedding?.embeddingNumbers && (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <FiDatabase className="inline mr-2" />
                      Embedding
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="numbers">
                      <TabsList>
                        <TabsTrigger value="numbers">
                          Embedding Numbers
                        </TabsTrigger>
                        <TabsTrigger value="text">Chunk Text</TabsTrigger>
                      </TabsList>
                      <TabsContent value="numbers">
                        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                          {data.embedding?.embeddingNumbers
                            .slice(0, 100)
                            .join(", ")}
                          {data.embedding.embeddingNumbers.length > 100 &&
                            "..."}
                        </ScrollArea>
                      </TabsContent>
                      <TabsContent value="text">
                        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                          {data.embedding?.chunkText.map((chunk, index) => (
                            <p key={index}>{chunk}</p>
                          ))}
                        </ScrollArea>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CrawlResultPreview;
