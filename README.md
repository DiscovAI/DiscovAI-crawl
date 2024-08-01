# DiscovAI Crawl API 🕷️🔍

> One API to scrape everything you need from URLs for your AI tool and vector database.

🚧 **Work in Progress** 🚧

## 🌟 Features

Our API provides a comprehensive suite of data extraction and processing capabilities:

- 🧼 Clean HTML (JavaScript and CSS removed)
- 📝 LLM-friendly Markdown conversion
- 🚫 Ad-free, cookie banner-free, and dialog-free content
- 📸 Website screenshots (auto-saved to AWS S3 or Cloudflare R2)
- 🤖 LLM-generated SEO-friendly content
- 🔑 LLM-extracted key information (summary, features, FAQs, etc.)
- 🧠 Ready-to-use embeddings for vector database integration (auto-saved to db)

## 🔧 Installation

```bash
pnpm i
pnpm exec playwright install
```

## 🚀 Usage

```bash
pnpm dev
node scripts/test.js
```

## 📦 API Response Structure

```json
{
  "clean_html": "...",
  "LLM_friendly_markdown": "...",
  "clean_text": "...",
  "screenshot_url": "...",
  "llm_extracts_key_info": {
    "what": "...",
    "summary": "...",
    "features": ["...", "..."],
    "faqs": [{"q": "...", "a": "..."}]
  },
  "llm_summarized_detail": "...",
  "embeddings": [...]
}
```

## 📚 Documentation

TODO

## 🤝 Contributing

TODO
