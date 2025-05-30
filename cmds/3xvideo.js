const axios = require("axios");
const { sendMessage } = require('../handles/message');

module.exports = {
  name: "3xvideo",
  description: "Fetch videos from the new API",
  role: 1,
  author: "GeoDevz69",

  async execute(senderId, args, pageAccessToken) {
    try {
      const page = args[0] || 1; // Default to page 1 if no argument is provided

      const response = await axios.get(`https://betadash-api-swordslush-production.up.railway.app/lootedpinay?page=${page}`);
      const result = response.data;

      if (!result || !Array.isArray(result.result) || result.result.length === 0) {
        return sendMessage(senderId, { text: "No video found for the given page." }, pageAccessToken);
      }

      const firstVideo = result.result[0]; // use the first video in the result

      const message = `📹 Video Result:\n\n` +
                      `📝 Title: ${firstVideo.title || "N/A"}\n` +
                      `🔗 Video URL: ${firstVideo.videoUrl || "N/A"}`;

      // Send text message with video details
      await sendMessage(senderId, { text: message }, pageAccessToken);

      // Send video thumbnail if available
      if (firstVideo.image) {
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: {
              url: firstVideo.image,
              is_reusable: true
            }
          }
        }, pageAccessToken);
      }

    } catch (error) {
      console.error('Error:', error.message);
      sendMessage(senderId, { text: "An error occurred while processing the request." }, pageAccessToken);
    }
  }
};
