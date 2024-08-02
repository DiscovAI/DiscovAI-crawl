import bodyParser from "body-parser";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import {
  scrapeController,
  scrapeMiddlware,
} from "./controller/scrape-conroller";
import { testController } from "./controller/test-controller";
import { initializeBrowser, shutdownBrowser } from "./lib/browser/playwright";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cors());

app.post("/scrape", scrapeMiddlware, scrapeController);
app.get("/test", testController);

app.listen(port, () => {
  initializeBrowser().then(() => {
    console.log(`Server is running on port ${port}`);
  });
});

process.on("SIGINT", () => {
  shutdownBrowser().then(() => {
    console.log("Browser closed");
    process.exit(0);
  });
});
