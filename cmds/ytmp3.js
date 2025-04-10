const axios = require("axios");
const { sendMessage } = require("../handles/message");

console.log("sendMessage function:", sendMessage); 

module.exports = {
  name: "ytmp3",
  description: "YouTube mp3 downloader using url",
  role: 1,
  author: "Mark and GeoDevz69",

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(" ");

    if (!prompt) {
      return sendMessage(senderId, {
        text: `Usage: ytmp3dl [ URL ]`
      }, pageAccessToken);
    }

    try {
      const apiUrl = `https://autobot.mark-projects.site/api/ytsmp3?query=${encodeURIComponent(prompt)}`;
const response = await axios.get(apiUrl);
const { title, download_url } = response.data.data;

console.log("Title:", title);
console.log("Download URL:", download_url); 
      
      await sendMessage(senderId, {
        text: ` Title : ${title} \n Download url ${audio} \n`
      }, pageAccessToken);
      
 
      await sendMessage(senderId, {
        attachment: {
          type: "audio",
          payload: {
            url: audio
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error("error pa fix kay owner:", error);
      sendMessage(senderId, {
        text: `error pa fix kay owner. Please try again or check your input.`
      }, pageAccessToken);
    }
  }
};
