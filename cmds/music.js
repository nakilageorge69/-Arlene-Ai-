const axios = require("axios");
const { sendMessage } = require("../handles/message");

module.exports = {
  name: "music",
  description: "Search music from SoundCloud and send audio",
  role: 1,
  author: "GeoDevz69",

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(" ");

    if (!prompt) {
      return sendMessage(senderId, {
        text: `╭─『 𝗠𝗨𝗦𝗜𝗖 』✧✧✧\n╰✧ Please provide the title of the music!`
      }, pageAccessToken);
    }

    const apiUrl = `https://betadash-api-swordslush-production.up.railway.app/sc?search=${encodeURIComponent(prompt)}`;
    const userAgents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3)...",
      "Mozilla/5.0 (Linux; Android 10; Pixel 3 XL)..."
    ];

    try {
      await sendMessage(senderId, {
        text: `🔍 Searching for "${prompt}"...`
      }, pageAccessToken);

      const response = await axios.get(apiUrl, {
        headers: {
          'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
        }
      });

      const { title, lyrics, audio_b64 } = response.data;

      if (!title || !audio_b64) {
        return sendMessage(senderId, {
          text: `❌ Music not found. Try another title.`
        }, pageAccessToken);
      }

      const audioUrl = `data:audio/mp3;base64,${audio_b64}`;

      await sendMessage(senderId, {
        text: `🎵 Title: ${title}\n\n${lyrics || ''}`
      }, pageAccessToken);

      await sendMessage(senderId, {
        attachment: {
          type: "audio",
          payload: {
            url: audioUrl
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error("Error fetching music:", error.message || error);
      sendMessage(senderId, {
        text: `⚠️ An error occurred while fetching the music. Please try again later.`
      }, pageAccessToken);
    }
  }
};
