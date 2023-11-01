import puppeteer from "puppeteer";

import { scrapeMovies, scrapeDate } from "./scraping.js";
import { createEvent, createEventData } from "./calendar.js";
import { logger } from "./utils.js";

import { config } from "dotenv";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const dotenv = require("dotenv");
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

console.log("Running the script on a 7-day schedule on Fridays.");

const launchPuppeteer = async () => {
  return puppeteer
    .launch({ headless: false })
    .then((browser) => {
      return browser.pages();
    })
    .then((pages) => {
      const [page] = pages;
      return page.setViewport({ width: 1200, height: 720 });
    });
};

const main = async () => {
  let movieDate;
  const browser = await puppeteer.launch({ headless: false });
  const [page] = await browser.pages();
  await page.setViewport({ width: 1200, height: 720 });

  try {
    const url = "http://www.capitolio.org.br/programacao/";
    await page.goto(url, { waitUntil: "domcontentloaded" });
  } catch (err) {
    logger.error("Couldn't reach Capitólio website:", err);
  }

  const dateHrefs = await page.$$eval(".dates a.date", (elements) =>
    elements.map((element) => element.href)
  );

  for (const url of dateHrefs) {
    await page.goto(url);

    const movieData = await scrapeMovies(page).catch((err) =>
      logger.error("movie scraping failed:", err)
    );

    movieDate = await scrapeDate(page).catch((err) =>
      logger.error("movie scraping failed:", err)
    );

    for (const movie of movieData) {
      const eventData = createEventData({ ...movie, movieDate });
      await createEvent(eventData).catch((err) =>
        logger.error("Add movie event to calendar failed:", err)
      );
    }
  }

  logger.info(`Agenda for day ${movieDate} complete!`);
  browser.close();
};

try {
  main();
  logger.log("Agenda for the week completed successfully!!");
} catch (err) {
  logger.error("Error:", err);
}
