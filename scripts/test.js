var fs = require("fs/promises");
var path = require("path");
(async () => {
  const resp = await fetch("http://localhost:8000/scrape", {
    method: "POST",
    body: JSON.stringify({
      url: "https://www.screen.studio/",
      need_screenshot: true,
      llm_extract: true,
      llm_detail: true,
      need_embedding: true,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  await fs.writeFile(
    path.join(process.cwd(), "temp/test.json"),
    JSON.stringify(await resp.json())
  );
})();
