const puppeteer = require("puppeteer");
const { getNextPage, scrapeData } = require("./src/scrape");
const { initOutputDirectory, downloadAndSaveImage } = require("./src/io");
const { getURL, constructFileName } = require("./src/utils");


const START_PAGE = 1;
const OUTPUT_DIRECTORY = "komixxy";

(async () => {
    const browser = await puppeteer.launch({headless: true});
    process.on("unhandledRejection", (reason, promise) => {
        console.error("Unhandled Rejection at: Promise", promise, "reason:", reason);
        browser.close();
    });
    const page = await browser.newPage();

    // scrape and save
    initOutputDirectory(OUTPUT_DIRECTORY);
    
    const paginate = async (page, nextPage) => {
        const pageNumber = Number(nextPage.split("/").pop());
        await page.goto(nextPage, {waitUntil: 'networkidle2'});

        const isFaulty = await page.$("div#framework_error") ? true : false;
    
        if(!isFaulty){
            const data = await scrapeData(page);
            data.forEach(async entry => {
                const image_url = entry.image_src;
                const fileName = constructFileName(entry);
                await downloadAndSaveImage(image_url, fileName, OUTPUT_DIRECTORY);
            });
            console.log("\x1b[32m%s\x1b[0m", `#${pageNumber} page scraped and saved!`);

            nextPage = await getNextPage(page);
        }
        else{
            nextPage = getURL(pageNumber+1);
            console.log("\x1b[31m%s\x1b[0m", `#${pageNumber} is faulty. Skipping to ${pageNumber+1}...`);
        }
        
        if(nextPage) await paginate(page, nextPage);
    };
    await paginate(page, getURL(START_PAGE));


    await browser.close();
})();

