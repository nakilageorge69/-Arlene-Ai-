const axios = require("axios");
const { sendMessage } = require("../handles/message");

console.log("sendMessage function:", sendMessage);

module.exports = {
  name: "ytdl",
  description: "YouTube Downloader",
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
      const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/ytdl?url=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);

      console.log("API response:", response.data);

      const { status, title, thumbnail, video, audio } = response.data;

      if (status !== "true" || !video) {
        return sendMessage(senderId, {
          text: `Failed to retrieve the download link. Please check the URL and try again.`
        }, pageAccessToken);
      }

      // Send video details
      await sendMessage(senderId, {
        text: `✅ **Title:** ${title}\n\n🎥 **Video Download:** [Click here](${video})\n\n🔈 **Audio Download:** [Click here](${audio})`,
        attachment: {
          type: "image",
          payload: {
            url: thumbnail
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
