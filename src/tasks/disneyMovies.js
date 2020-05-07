const displayPicturesUrl =
  "https://en.wikipedia.org/wiki/List_of_Walt_Disney_Pictures_films";

/**
 * Extract Disney's movie pictures data
 *
 * @fixme Passing functions with `page.exposeFunction` don't seems to work properly,
 *        so I'had to declare utilities functions into `page.evaluate` which is subobtimal
 */
export default async ({ page }) => {
  await page.goto(displayPicturesUrl, { waitUntil: "networkidle0" });

  const pictureList = await page.evaluate(() => {
    // Creates a pipeline of functions with the output of one function connected to the input of the next.
    // @see https://medium.com/javascript-scene/curry-and-function-composition-2c208d774983
    const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

    // Extract table TDs from TR elements
    const getRows = (rows) =>
      rows.map((row) => [...row.querySelectorAll("td")]);

    // Remove empty rows
    const removeEmpty = (rows) => rows.filter((row) => row.length);

    // Resolve HTML tables's TD rowspan
    const ungroupRows = (count) => (rows) =>
      rows.map((row, i, rows) => {
        if (row.length < count) {
          let prevI = i - 1;
          while (rows[prevI].length < count) --prevI;

          let prevRow = rows[prevI];
          prevRow.forEach((el, i) => {
            if ((parseInt(el.getAttribute("rowspan"), 10) || 0) > 1)
              row.splice(i, 0, el);
          });
        }
        return row;
      });

    // Extract the Wikipedia URL from the movie picture's title HTML element
    const extractUrl = (el) => {
      const a = el.querySelector("a");
      return a ? a.href : null;
    };

    // Extract a date string from an HTML element and apply transformations so it can be parsed by a Date Object
    // @example "December 1, 1952" become "01 Dec 1952"
    const toDate = (el) => {
      const first = el.firstChild;
      const rawDate = first instanceof Text ? first.nodeValue : first.innerText;
      const parts = rawDate.split(/,?\s/);

      if (parts.length === 3) {
        const dayOfTheMonth = parts[1].padStart(2, "0");
        const monthInYearShort = parts[0].substr(0, 3); // @example Jan,Feb,Mar,...
        const year = parts[2];
        return new Date(
          `${dayOfTheMonth} ${monthInYearShort} ${year} 00:00:00 GMT`
        ).toISOString();
      }

      // Assume `rawDate` is a year string
      return new Date(rawDate).toISOString();
    };

    // Symbol used on the Wikipage to signify that the movie is a Disney+ exclusive
    const streamingExclusiveSymbol = "‡";

    // Extract movie picture data from TD's elements
    const toPictureData = (arr) =>
      arr.map(([type, title, date], i) => ({
        index: i + 1,
        type: type.innerText,
        title: title.firstChild.innerText,
        streamingExclusive: title.innerText.includes(streamingExclusiveSymbol),
        url: extractUrl(title),
        date: toDate(date),
      }));

    return pipe(
      getRows,
      removeEmpty,
      ungroupRows(4),
      toPictureData
    )([...document.querySelectorAll("table.sortable > tbody > tr")]);
  });

  console.log(`🎉 Extracted ${pictureList.length} Disney's releases`);

  return pictureList;
};
