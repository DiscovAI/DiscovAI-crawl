# DiscovAI Crawl API

🚧**WIP**🚧

---

one api to scrape everything from urls you need for your AI tool or vector database.

```js
{
  clean_html,
    LLM_friendly_markdown,
    clean_text,
    screenshot_url,
    llm_extracts_key_info,
    llm_summaried_detail,
    embeddings;
}
```

## Features

- clean html without js and css.
- LLM input friendly markdown
- no ads, cookie banner or dialog.
- screenshot of website, auto saved to aws s3 or cloudflare r2
- LLM generated seo friendly content of url
- LLM extracted key infomation like what, summary, features, faqs of url
- readly to use embeddings to build your vector database, (auto saved to database maybe)

## Install

```bash
pnpm i
pnpm exec playwright install
```

## Run

```bash
pnpm dev
node scripts/test.js
```
