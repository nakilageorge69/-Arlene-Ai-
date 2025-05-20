const axios = require("axios");
const { sendMessage } = require("../handles/message");

console.log("sendMessage function:", sendMessage); 

module.exports = {
  name: "fbdl",
  description: "Facebook downloader",
  role: 1,
  author: "GeoDevz69",

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(" ");

    if (!prompt) {
      return sendMessage(senderId, {
        text: `Usage: fbdl [ URL ]`
      }, pageAccessToken);
    }

    try {
      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/fbdlv2?url=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      const { success, url, title } = response.data;

      console.log("API response:", response.data);

      if (!success || !url) {
        return sendMessage(senderId, {
          text: `Failed to fetch the video. Please make sure the URL is a public Facebook video.`
        }, pageAccessToken);
      }

      await sendMessage(senderId, {
        text: `Title: ${title || 'No title available'}`
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
      console.error("Error occurred:", error.message);
      sendMessage(senderId, {
        text: `An error occurred while processing your request. Please try again later.`
      }, pageAccessToken);
    }
  }
};

