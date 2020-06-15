const getURL = (pageNumber) => `https://komixxy.pl/page/${pageNumber}`;

const parseDate = (date) => {
    const monthNames = [
        " stycznia ", " lutego ", " marca ", " kwietnia ", " maja ", " lipca ", 
        " czerwca ", " sierpnia ", " września ", " października ", " listopada ", " grudnia "
    ];

    monthNames.forEach((month, i) => {
        date = date.replace(month, `.${i+1}.`);
    });

    return date;
};

// Wrzucone 23 czerwca 2013 o 17:17 przez konto usunięte | Skomentuj (29) | było | Do ulubionych

const parseInfo = (info) => {
    info = info.split(" | ")[0].replace("Wrzucone ", "").replace(" (PW)", "");
    info = info.replace("konto usunięte", "_DELETED_USER_");
    
    const [date, timeAndAuthor] = info.split(" o ");
    const [time, author] = timeAndAuthor.split(" przez ");

    const parsedDate = parseDate(date);
    const parsedTime = time.replace(":", ".");

    return { date: parsedDate, time: parsedTime, author };
};

const constructFileName = (data) => {
    const { title, NSFW, likes, date, time, author } = data;
    
    const name = `'${title.replace("/", "-")}' by ${author} ${date}-${time} (${likes} likes)${NSFW ? " NSFW": ""}.jpg`;
    const sanitizedName = name.replace(/\<|\>|\:|\"|\/|\\|\||\?|\*/g, "$");

    return sanitizedName;
};


module.exports = {
    getURL,
    parseInfo,
    constructFileName
};