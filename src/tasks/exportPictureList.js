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
 * Export Disney's Movies List into a JSON file
 */
export default (pictureList) => {
    ensureDirectory(process.env.EXPORT_DIRECTORY);
    writeFileSync(join(process.env.EXPORT_DIRECTORY, 'movies.json'), JSON.stringify(pictureList, null, 2));
};
