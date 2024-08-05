const jina_api_key = process.env.JINA_API_KEY;

export async function jinaReader(url: string) {
  try {
    const resp = await fetch(`https://r.jina.ai/${url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jina_api_key}`,
        "X-With-Generated-Alt": "true",
      },
    });
    return await resp.text();
  } catch (error) {
    return "";
  }
}
