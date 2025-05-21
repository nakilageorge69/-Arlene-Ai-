const axios = require("axios");
const { sendMessage } = require("../handles/message");

console.log("sendMessage function:", sendMessage);

module.exports = {
  name: "ytdl",
  description: "Facebook downloader",
  role: 1,
  author: "GeoDevz69",

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(" ");

    if (!prompt) {
      return sendMessage(senderId, {
        text: `Usage: ytdl [ URL ]`
      }, pageAccessToken);
    }

    try {
      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/ytdlv5?url=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      console.log("API response:", response.data);

      const formats = response.data.formats;
      if (!formats || formats.length === 0) {
        return sendMessage(senderId, {
          text: `No downloadable formats found. Please try a different URL.`
        }, pageAccessToken);
      }

      // Try to find 360p mp4 format, fallback to any mp4 format
      const preferredFormat = formats.find(f => f.format_note === "360p" && f.url.includes("mp4")) ||
                              formats.find(f => f.url.includes("mp4")) ||
                              formats[0]; // fallback to first format

      if (!preferredFormat?.url) {
        return sendMessage(senderId, {
          text: `Failed to extract a valid video URL from the API response.`
        }, pageAccessToken);
      }

      await sendMessage(senderId, {
        text: `Here is your downloaded video:`
      }, pageAccessToken);

      await sendMessage(senderId, {
        attachment: {
          type: "video",
          payload: {
            url: preferredFormat.url
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
