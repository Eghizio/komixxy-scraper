const fs = require("fs");
const path = require("path");
const axios = require("axios");


const initOutputDirectory = (directory) => {
    if(!fs.existsSync(directory)){
        fs.mkdirSync(directory);
        console.log("\x1b[32m%s\x1b[0m", `Output directory '${directory}' created!`);
    }
};

const downloadAndSaveImage = async (url, name, outputDirectory) => {  
    const src = path.resolve(outputDirectory, name);
    console.log("\x1b[33m%s\x1b[0m", `Saving...\n"${src}"`);
    const writer = fs.createWriteStream(src);
    
    const response = await axios({
        url,
        method: "GET",
        responseType: "stream"
    });
    
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });
};


module.exports = {
    initOutputDirectory,
    downloadAndSaveImage
};