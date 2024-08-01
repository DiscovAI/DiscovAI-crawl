import {
  chromium,
  Browser,
  BrowserContext,
  Route,
  Request as PlaywrightRequest,
} from "playwright";
import randomUseragent from "random-useragent";

export let browser: Browser;
export let context: BrowserContext;

export const BLOCK_MEDIA =
  (process.env.BLOCK_MEDIA || "False").toUpperCase() === "TRUE";

export const PROXY_SERVER = process.env.PROXY_SERVER || null;
export const PROXY_USERNAME = process.env.PROXY_USERNAME || null;
export const PROXY_PASSWORD = process.env.PROXY_PASSWORD || null;

const AD_SERVING_DOMAINS = [
  "doubleclick.net",
  "adservice.google.com",
  "googlesyndication.com",
  "googletagservices.com",
  "googletagmanager.com",
  "google-analytics.com",
  "adsystem.com",
  "adservice.com",
  "adnxs.com",
  "ads-twitter.com",
  "facebook.net",
  "fbcdn.net",
  "amazon-adsystem.com",
];

export const initializeBrowser = async () => {
  browser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  });

  const userAgent = randomUseragent.getRandom();
  const viewport = { width: 1280, height: 800 };

  const contextOptions: any = {
    userAgent,
    viewport,
  };

  if (PROXY_SERVER && PROXY_USERNAME && PROXY_PASSWORD) {
    contextOptions.proxy = {
      server: PROXY_SERVER,
      username: PROXY_USERNAME,
      password: PROXY_PASSWORD,
    };
  } else if (PROXY_SERVER) {
    contextOptions.proxy = {
      server: PROXY_SERVER,
    };
  }

  context = await browser.newContext(contextOptions);

  if (BLOCK_MEDIA) {
    await context.route(
      "**/*.{png,jpg,jpeg,gif,svg,mp3,mp4,avi,flac,ogg,wav,webm}",
      async (route: Route, request: PlaywrightRequest) => {
        await route.abort();
      }
    );
  }

  // Intercept all requests to avoid loading ads
  await context.route("**/*", (route: Route, request: PlaywrightRequest) => {
    const requestUrl = new URL(request.url());
    const hostname = requestUrl.hostname;

    if (AD_SERVING_DOMAINS.some((domain) => hostname.includes(domain))) {
      console.log(hostname);
      return route.abort();
    }
    return route.continue();
  });
};

export const shutdownBrowser = async () => {
  if (context) {
    await context.close();
  }
  if (browser) {
    await browser.close();
  }
};
