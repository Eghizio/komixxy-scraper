const { parseInfo } = require("./utils");


const getNextPage = async (page) => {
    const nextPage = await page.evaluate(() => {
        const paginator = document.querySelector("div#paginator_3000.paginator");
        const buttons = [...paginator.children[0].children[0].children[0].children];
        const current = buttons.map(td => td.children[0]).map(span => span.children[0]).filter(el => el.nodeName==="STRONG")[0];
        const currentIndex = buttons.map(el => el.innerText).indexOf(current.innerText);
        
        const nextPage = buttons[currentIndex+1].children[0].children[0].href || null;

        return nextPage;
    });

    return nextPage;
};

const scrapeData = async (page) => {
    const comicsData = await page.evaluate(() => {
        const comics = [...document.querySelectorAll("div.pic[id^='pic']")];
        const comicsData = comics.map(comic => {
            const title = comic.querySelector("h1.picture").innerText;
            const likes = comic.querySelector(".votes_up").innerText;
            const info = comic.querySelector("div.infobar").innerText;

            const NSFW = comic.querySelector("img.pic").hasAttribute("data-src");
            const image_src = NSFW ? "https://komixxy.pl" + comic.querySelector("img.pic").getAttribute("data-src") : comic.querySelector("img.pic").src;
            
            return { title, NSFW, image_src, likes, info };
        });

        return comicsData;
    });

    // should it be in main?
    const data = comicsData.map(data => {
        const { title, NSFW, image_src, likes, info } = data;
        const { date, time, author } = parseInfo(info);

        return { title, NSFW, image_src, likes, date, time, author };
    });
    return data;
};


module.exports = {
    getNextPage,
    scrapeData
};