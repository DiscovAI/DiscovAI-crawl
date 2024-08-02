var fs = require("fs/promises");
var path = require("path");
async function call(url) {
  return await fetch("http://localhost:8000/scrape", {
    method: "POST",
    body: JSON.stringify({
      url,
      need_screenshot: false,
      llm_extract: true,
      llm_detail: false,
      need_embedding: false,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
(async () => {
  const urls = [
    "https://www.screen.studio/",
    // "https://www.screen.studio/",
    // "https://www.screen.studio/",
    // "https://www.screen.studio/",
  ];
  const resps = await Promise.all(urls.map((u) => call(u)));
  const json = [];
  for await (let r of resps) {
    json.push(await r.json());
  }
  await fs.writeFile(
    path.join(process.cwd(), "temp/test.json"),
    JSON.stringify(json)
  );
})();
