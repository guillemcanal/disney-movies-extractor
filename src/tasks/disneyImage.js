import downloadImage from "./downloadImage";
import sanitize from "sanitize-filename";

/**
 * Create a cover's filename from a `picture` (movie) Object
 * @param {Object} picture
 */
const getFilename = (picture) =>
  sanitize(
    `${String(picture.index).padStart(2, "0")}. ${picture.title} (${new Date(
      picture.date
    ).getFullYear()}).png`
  );

/**
 * 1. Retreive the movie picture's cover
 * 2. Schedule the cover download on the local filesystem using `cluster.queue`
 */
export default async ({ page, data: { picture, cluster } }) => {
  await page.goto(picture.url, { waitUntil: "networkidle0" });
  const image = await page.evaluate(() => {
    const json = JSON.parse(
      document.querySelector('script[type="application/ld+json"]').innerText
    );
    return "image" in json ? json.image : null;
  });

  const imageFilename = getFilename(picture);

  if (image) {
    console.log(`🎥 Got image for movie ${picture.title}`);
    cluster.queue({ image, imageFilename, picture }, downloadImage);
  }

  return { ...picture, image, imageFilename };
};
