const axios = require("axios");
const { sendMessage } = require("../handles/message");

console.log("sendMessage function:", sendMessage); 

module.exports = {
  name: "socialmediadownloader",
  description: "TikTok,Facebook and Instagram Video Downloader",
  role: 1,
  author: "Mark and GeoDevz69",

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(" ");

    if (!prompt) {
      return sendMessage(senderId, {
        text: `Usage: dl [ URL ]`
      }, pageAccessToken);
    }

    try {
      const apiUrl = `https://autobot.mark-projects.site/api/download?url=${encodeURIComponent(prompt)}`;
const response = await axios.get(apiUrl);

const { url, filename } = response.data.data;

console.log("Sending message with API URL:", apiUrl);
console.log("Download URL:", url);
console.log("Filename:", filename);
      
      await sendMessage(senderId, {
        text: ` response : ${description} \n`
      }, pageAccessToken);
      
 
      await sendMessage(senderId, {
        attachment: {
          type: "video",
          payload: {
            url: url
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
