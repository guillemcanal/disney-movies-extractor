import { Cluster } from "puppeteer-cluster";
import vanillaPuppeteer from "puppeteer";
import { addExtra } from "puppeteer-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import taskDisneyMovies from "./tasks/disneyMovies";
import taskDisneyImage from "./tasks/disneyImage";
import exportPictureList from "./tasks/exportPictureList";

async function main() {
  const puppeteer = addExtra(vanillaPuppeteer);
  puppeteer.use(Stealth());

  // Launch cluster with puppeteer-extra
  const cluster = await Cluster.launch({
    puppeteer,
    maxConcurrency: process.env.CRAWLER_CONCURRENCY,
    concurrency: Cluster.CONCURRENCY_CONTEXT
  });

  // Retreive a list of Disney Movies
  const disneyMovies = await cluster.execute(null, taskDisneyMovies);
  
  // For each movies, retreive their covers on their respective Wikipedia pages
  const disneyMoviesWithImages = await Promise.all(
    disneyMovies
      .filter((picture) => picture.url)
      .slice(0, process.env.CRAWLER_LIMIT_MOVIES)
      .map((picture) => cluster.execute({picture, cluster}, taskDisneyImage))
  );

  exportPictureList(disneyMoviesWithImages);

  await cluster.idle();
  await cluster.close();
}

main().catch(console.warn);
