const fs = require("fs");
const path = require("path");
const axios = require("axios");


const initOutputDirectory = (directory) => {
    if(!fs.existsSync(directory)){
        fs.mkdirSync(directory);
        Logger.success(`Output directory '${directory}' created!`);
    }
};

const downloadAndSaveImage = async (url, name) => {  
    const src = path.resolve(__dirname, "komixxy", name);
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
    })
};


module.exports = {
    initOutputDirectory,
    downloadAndSaveImage
};