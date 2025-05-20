const axios = require("axios");
const { sendMessage } = require('../handles/message'); // Ensure the path is correct

module.exports = {
  name: "spotify",
  description: "Search for a Spotify track using a keyword",
  role: 1,
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      return sendMessage(senderId, {
        text: `Usage: spotify [music title]`
      }, pageAccessToken);
    }

    try {
      const res = await axios.get('https://betadash-api-swordslush-production.up.railway.app/spt', {
        params: { title: searchQuery }
      });

      const trackData = res?.data;

      if (!trackData) {
        throw new Error("No results found");
      }

      const { title, duration, thumbnail, download_url, artists } = trackData;

      const minutes = Math.floor(duration / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

      // Send track info
      await sendMessage(senderId, {
        text: `🎶 Now playing: ${title}\n👤 Artist: ${artists}\n⏱ Duration: ${formattedDuration}`
      }, pageAccessToken);

      // Send album cover
      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: thumbnail
          }
        }
      }, pageAccessToken);

      // Send audio file
      await sendMessage(senderId, {
        attachment: {
          type: "audio",
          payload: {
            url: download_url
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error("Error retrieving the Spotify track:", error.message || error);
      await sendMessage(senderId, {
        text: `Error retrieving the Spotify track. Please try again or check your input.`
      }, pageAccessToken);
    }
  }
};
