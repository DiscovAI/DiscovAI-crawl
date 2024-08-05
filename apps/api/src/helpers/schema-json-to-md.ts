import { z } from "zod";
import { defaultExtractSchema } from "../service/llm-extract";

type ExtractType = z.infer<typeof defaultExtractSchema>;

export function generateMarkdownFromJson(data: ExtractType): string {
  const { webpage } = data;
  let markdown = "";

  // Title
  markdown += `# ${webpage.title}\n\n`;

  // Summary
  markdown += `## Summary\n${webpage.summary}\n\n`;

  // Keywords
  markdown += `## Keywords\n${webpage.keywords.join(", ")}\n\n`;

  // How to Use
  if (webpage.howToUse) {
    markdown += `## How to Use\n${webpage.howToUse}\n\n`;
  }

  // Features
  markdown += `## Features\n`;
  webpage.features.forEach((feature) => {
    markdown += `### ${feature.title}\n${feature.detail}\n\n`;
  });
  markdown += "\n";

  // FAQ
  markdown += `## FAQ\n`;
  webpage.faq.forEach((item) => {
    markdown += `### Q: ${item.q}\nA: ${item.a}\n\n`;
  });

  // Helpful Tips
  markdown += `## Helpful Tips\n`;
  webpage.helpfulTips.forEach((tip) => {
    markdown += `- ${tip}\n`;
  });
  markdown += "\n";

  // Testimonials (optional)
  if (webpage.testimonials && webpage.testimonials.length > 0) {
    markdown += `## Testimonials\n`;
    webpage.testimonials.forEach((testimonial) => {
      markdown += `> ${testimonial}\n\n`;
    });
  }

  // Call to Action (optional)
  if (webpage.callToAction && webpage.callToAction.length > 0) {
    markdown += `## Call to Action\n`;
    webpage.callToAction.forEach((action) => {
      markdown += `- ${action}\n`;
    });
  }

  return markdown;
}
