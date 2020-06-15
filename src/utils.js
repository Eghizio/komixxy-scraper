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
    info = info.replace("konto usunięte", "<DELETED_USER>");
    
    const [date, timeAndAuthor] = info.split(" o ");
    const [time, author] = timeAndAuthor.split(" przez ");

    const parsedDate = parseDate(date);

    return { date: parsedDate, time, author };
};


module.exports = {
    getURL,
    parseDate,
    parseInfo
};