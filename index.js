const puppeteer = require("puppeteer");
const { createEvent, createEventData } = require("./calendar");
const { scrapeMovies, scrapeDate } = require("./scraping");

console.log("Running the script on a 7-day schedule on Fridays.");

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const [page] = await browser.pages();
  await page.setViewport({ width: 1200, height: 720 });
  const url = "http://www.capitolio.org.br/programacao/";
  await page.goto(url, { waitUntil: "domcontentloaded" });

  const dateHrefs = await page.$$eval(".dates a.date", (elements) =>
    elements.map((element) => element.href)
  );
  console.log(dateHrefs);

  for (const url of dateHrefs) {
    await page.goto(url);

    const movieData = await scrapeMovies(page);
    const movieDate = await scrapeDate(page);

    for (const movie of movieData) {
      const eventData = createEventData({ ...movie, movieDate });
      try {
        const link = await createEvent(eventData);
        console.log("Event added to calendar:", link);
        // console.log(eventData.summary, eventData.start.dateTime);
      } catch (error) {
        console.error(error);
      }
    }
  }

  browser.close();
};

try {
  main();
} catch (err) {
  console.log(err);
}
