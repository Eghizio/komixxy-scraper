const puppeteer = require("puppeteer");
const { paginate } = require("./src/scrape");
const { initOutputDirectory, downloadAndSaveImage } = require("./src/io");
const { getURL, parseInfo } = require("./src/utils");


const START_PAGE = 1;
const OUTPUT_DIRECTORY = "komixxy";

(async () => {
    const browser = await puppeteer.launch({headless: true});
    process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled Rejection at: Promise", promise, "reason:", reason);
        browser.close();
    });
    const page = await browser.newPage();

    // scrape
    const data = await paginate(page, getURL(START_PAGE), []);
    
    // io
    initOutputDirectory(OUTPUT_DIRECTORY);

    await browser.close();
})();

