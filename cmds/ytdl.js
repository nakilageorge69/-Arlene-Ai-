const axios = require("axios");
const { sendMessage } = require("../handles/message");

module.exports = {
  name: "ytdl",
  description: "YouTube Video Downloader",
  role: 1,
  author: "GeoDevz69",

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(" ");

    if (!prompt) {
      return sendMessage(senderId, {
        text: `Usage: ytdl [ Facebook Video URL ]`
      }, pageAccessToken);
    }

    try {
      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/ytdl?url=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      console.log("API response:", response.data);

      const { author, title, thumbnail, duration, video } = response.data;

      if (!video) {
        return sendMessage(senderId, {
          text: `No downloadable video found. Please try a different Facebook video URL.`
        }, pageAccessToken);
      }

      const message = `🎬 Facebook Video Details:\n\n` +
                       `📝 Title: ${title || "No title"}\n` +
                       `👤 Author: ${author || "Unknown"}\n` +
                       `⏱ Duration: ${duration?.label || "Unknown"}\n` +
                       `🔗 Video Link: ${video}`;

      await sendMessage(senderId, { text: message }, pageAccessToken);

      // Send the video thumbnail
      if (thumbnail) {
        await sendMessage(senderId, {
          attachment: {
            type: "image",
            payload: {
              url: thumbnail,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }

      // Send the video
      await sendMessage(senderId, {
        attachment: {
          type: "video",
          payload: {
            url: video
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
