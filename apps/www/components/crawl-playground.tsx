"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ScrapeForm, { ScrapeModel } from "./crawl-form";
import ResultPreview from "./crawl-result";
import { Card, CardContent } from "@/components/ui/card";
const testData: any = {
  pageMetadata: {
    url: "https://www.screen.studio/",
    title: "Screen Studio — Professional screen recorder for macOS",
    description:
      "Screen recorder for macOS. Create engaging product demos, courses, tutorial and social media videos. Add automatic zoom on mouse actions, smooth mouse movement, and other powerful effects and animations. Designed for macOS.",
    keywords: "",
    lang: "en",
  },
  media: {
    screenshotUrl:
      "https://pub-34b40b80caeb499899757903b083a603.r2.dev/u0xg6z56739o7c87xaly8s1c.png",
  },
  llmOutput: {
    json: {
      webpage: {
        title: "Beautiful Screen Recordings in Minutes",
        summary:
          "Screen Studio is a powerful screen recording tool designed for macOS that allows users to create high-impact videos effortlessly. It features automatic zoom, smooth cursor movements, and easy editing capabilities, making it ideal for product demos, tutorials, and social media posts.",
        keywords: [
          "screen recording",
          "macOS",
          "video editing",
          "tutorials",
          "demos",
          "social media",
        ],
        howToUse:
          "Simply install Screen Studio on your macOS device, connect any iOS devices if needed, and start recording your screen, webcam, or system audio. Use the automatic features to enhance your video, and export it in your desired format.",
        features: [
          {
            title: "Automatic Zoom",
            detail:
              "Screen Studio automatically zooms in on actions performed on the screen, making demos and tutorials easier to follow.",
          },
          {
            title: "Easy Editing",
            detail:
              "Drag and drop zooms on the timeline with all heavy lifting done automatically.",
          },
          {
            title: "High-Quality Exports",
            detail:
              "Export videos in up to 4k 60fps or optimized GIFs with optimal settings.",
          },
          {
            title: "Customizable Branding",
            detail:
              "Change backgrounds, shadows, and spacing to match your brand.",
          },
          {
            title: "Record iOS Devices",
            detail:
              "Easily record your iPhone or iPad screen by connecting it via USB.",
          },
        ],
        faq: [
          {
            q: "How is Screen Studio different from other screen recording apps?",
            a: "Screen Studio offers unique features like automatic zoom, smooth cursor movements, and easy editing that set it apart from other screen recording tools.",
          },
          {
            q: "Is the Windows version ready?",
            a: "Currently, Screen Studio is designed specifically for macOS.",
          },
          {
            q: "Is Screen Studio privacy focused?",
            a: "Yes, all processing happens on your machine, and no data is sent to our servers.",
          },
          {
            q: "Can I get a refund if I don't like it?",
            a: "Refund policies can be discussed directly with customer support.",
          },
          {
            q: "Is there an education discount?",
            a: "Yes, education discounts may be available upon request.",
          },
          {
            q: "What features will be added in the future?",
            a: "Future features are being planned based on user feedback.",
          },
          {
            q: "What macOS version is required?",
            a: "macOS Ventura 13.1 or later is recommended.",
          },
        ],
        helpfulTips: [
          "Utilize the automatic zoom feature to enhance viewer engagement.",
          "Experiment with different cursor sizes and movements for better visibility.",
          "Use the export presets for optimal settings based on your target platform.",
        ],
        testimonials: [
          '"Screen Studio is the best tool I\'ve picked up for my Mac in YEARS!" - Brendan O’Leary',
          '"This is definitely one of the best screen-recording apps that I have used." - Abhishek Vijayvergiya',
          '"Screen recordings look amazing!" - Sukh',
          '"I can\'t put into words how much I adore Screen Studio!" - Vahe Hovhannisyan',
        ],
        callToAction: [
          "Download Screen Studio now for a one-time purchase of $89!",
          "Join thousands of satisfied users and elevate your screen recording game!",
        ],
      },
    },
    markdown:
      '# Beautiful Screen Recordings in Minutes\n\n## Summary\nScreen Studio is a powerful screen recording tool designed for macOS that allows users to create high-impact videos effortlessly. It features automatic zoom, smooth cursor movements, and easy editing capabilities, making it ideal for product demos, tutorials, and social media posts.\n\n## Keywords\nscreen recording, macOS, video editing, tutorials, demos, social media\n\n## How to Use\nSimply install Screen Studio on your macOS device, connect any iOS devices if needed, and start recording your screen, webcam, or system audio. Use the automatic features to enhance your video, and export it in your desired format.\n\n## Features\n### Automatic Zoom\nScreen Studio automatically zooms in on actions performed on the screen, making demos and tutorials easier to follow.\n\n### Easy Editing\nDrag and drop zooms on the timeline with all heavy lifting done automatically.\n\n### High-Quality Exports\nExport videos in up to 4k 60fps or optimized GIFs with optimal settings.\n\n### Customizable Branding\nChange backgrounds, shadows, and spacing to match your brand.\n\n### Record iOS Devices\nEasily record your iPhone or iPad screen by connecting it via USB.\n\n\n## FAQ\n### Q: How is Screen Studio different from other screen recording apps?\nA: Screen Studio offers unique features like automatic zoom, smooth cursor movements, and easy editing that set it apart from other screen recording tools.\n\n### Q: Is the Windows version ready?\nA: Currently, Screen Studio is designed specifically for macOS.\n\n### Q: Is Screen Studio privacy focused?\nA: Yes, all processing happens on your machine, and no data is sent to our servers.\n\n### Q: Can I get a refund if I don\'t like it?\nA: Refund policies can be discussed directly with customer support.\n\n### Q: Is there an education discount?\nA: Yes, education discounts may be available upon request.\n\n### Q: What features will be added in the future?\nA: Future features are being planned based on user feedback.\n\n### Q: What macOS version is required?\nA: macOS Ventura 13.1 or later is recommended.\n\n## Helpful Tips\n- Utilize the automatic zoom feature to enhance viewer engagement.\n- Experiment with different cursor sizes and movements for better visibility.\n- Use the export presets for optimal settings based on your target platform.\n\n## Testimonials\n> "Screen Studio is the best tool I\'ve picked up for my Mac in YEARS!" - Brendan O’Leary\n\n> "This is definitely one of the best screen-recording apps that I have used." - Abhishek Vijayvergiya\n\n> "Screen recordings look amazing!" - Sukh\n\n> "I can\'t put into words how much I adore Screen Studio!" - Vahe Hovhannisyan\n\n## Call to Action\n- Download Screen Studio now for a one-time purchase of $89!\n- Join thousands of satisfied users and elevate your screen recording game!\n',
  },
  embeddings: {},
};
export default function ScrapingPlayground() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<ScrapeModel>({
    url: "",
    wait_after_load: 1000,
    timeout: 15000,
    need_screenshot: true,
    llm_extract: true,
    need_embedding: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const initialFetchDone = useRef(false);

  useEffect(() => {
    const url = searchParams.get("url");
    const newFormData = {
      url: url || "",
      wait_after_load: Number(searchParams.get("wait_after_load")) || 1000,
      timeout: Number(searchParams.get("timeout")) || 15000,
      need_screenshot: searchParams.get("need_screenshot") === "true",
      llm_extract: searchParams.get("llm_extract") === "true",
      need_embedding: searchParams.get("need_embedding") === "true",
    };

    // If URL is not empty, trigger the query
    if (url && !initialFetchDone.current) {
      setFormData(newFormData);
      fetchData(newFormData);
      initialFetchDone.current = true;
    }
  }, [searchParams]);

  async function fetchData(values: ScrapeModel) {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8000/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }
  function onSubmit(values: ScrapeModel) {
    // Update URL with form data
    const params = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    router.push(`?${params.toString()}`);

    // Fetch data
    fetchData(values);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <ScrapeForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        defaultValues={formData}
      />

      {error && (
        <Card className="w-[800px] bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && <ResultPreview data={result} />}
    </div>
  );
}
