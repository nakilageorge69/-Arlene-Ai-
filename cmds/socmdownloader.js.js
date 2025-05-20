const axios = require("axios");
const { sendMessage } = require("../handles/message");

console.log("sendMessage function:", sendMessage);

module.exports = {
  name: "socmdownloader",
  description: "Facebook Video Downloader via BetaDash",
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
      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/fbdlv2?url=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      const data = response.data;

      if (!data || !data.success || !data.url) {
        return sendMessage(senderId, {
          text: `Download failed. Please check the URL or try again later.`
        }, pageAccessToken);
      }

      console.log("API response:", data);

      await sendMessage(senderId, {
        text: `Video Title: ${data.title || 'N/A'}`
      }, pageAccessToken);

      await sendMessage(senderId, {
        attachment: {
          type: "video",
          payload: {
            url: data.url
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error("Error occurred:", error.message);
      sendMessage(senderId, {
        text: `An error occurred. Please try again later or contact the developer.`
      }, pageAccessToken);
    }
  }
};
