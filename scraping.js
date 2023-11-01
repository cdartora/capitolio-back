const scrapeMovies = async (page) => {
  return page.evaluate(() => {
    const movieElements = Array.from(document.querySelectorAll(".movie"));
    const movies = [];

    movieElements.forEach((movieElement) => {
      const titleElement = movieElement.querySelector(".movie-title");
      const title = titleElement.textContent.trim();
      const ticketInfo = movieElement
        .querySelector(".movie-subtitle")
        .textContent.trim();

      const descriptionElement = movieElement.querySelector(".movie-director");
      const description = descriptionElement.textContent.trim();

      const timings = movieElement
        .querySelector(".movie-detail-blocks span")
        .textContent.trim();

      const linkElement = movieElement.querySelector(".read-more");
      const link = linkElement ? linkElement.href : null;

      movies.push({
        title: `${title} - ${ticketInfo}`,
        description: `${description} 
Leia mais: ${link}`,
        timings,
        link,
      });
    });

    return movies;
  });
};

const scrapeDate = async (page) =>
  page.evaluate(() => {
    const dateElement = document.querySelector(".date.selected .date-number");
    return dateElement ? dateElement.textContent.trim() : null;
  });

export { scrapeMovies, scrapeDate };
