import { join } from "path";
import { writeFileSync, existsSync, mkdirSync } from "fs";

/**
 * Ensure that a given directory path exists, create it otherwize
 * @param {String} path 
 */
const ensureDirectory = (path) => {
  if (!existsSync(path)) mkdirSync(path, { mode: "0745", recursive: true });
};

/**
 * Download a movie's cover into an `images` directory
 */
export default async ({ page, data: { image, imageFilename, picture } }) => {
  const directoryPath = join(process.env.EXPORT_DIRECTORY, "images");
  ensureDirectory(directoryPath);

  const filename = join(directoryPath, imageFilename);
  const imageData = await page.goto(image);

  writeFileSync(filename, await imageData.buffer());

  console.log(`💾 Image for movie "${picture.title}" saved in "${filename}"`)
};
