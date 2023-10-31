const puppeteer = require("puppeteer");
const { createEvent, createEventData } = require("./calendar");
const { scrapeMovies, scrapeDate } = require("./scraping");

const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

console.log("Running the script on a 7-day schedule on Fridays.");

const main = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const [page] = await browser.pages();
    await page.setViewport({ width: 1200, height: 720 });
  } catch (err) {
    logger.error("Something setting up puppetteer failed:", err);
  }

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

    const movieDate = await scrapeDate(page).catch((err) =>
      logger.error("movie scraping failed:", err)
    );

    for (const movie of movieData) {
      const eventData = createEventData({ ...movie, movieDate });
      await createEvent(eventData).catch((err) =>
        logger.error("Add movie event to calendar failed:", err)
      );
    }
  }

  logger.log(`Agenda for day ${movieDate} complete!`);
  browser.close();
};

try {
  main();
  logger.log("Agenda for the week completed successfully!!");
} catch (err) {
  logger.error("Error:", err);
}
