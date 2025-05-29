const axios = require("axios");
const { sendMessage } = require('../handles/message');

module.exports = {
  name: "news",
  description: "Search for news articles",
  role: 1,
  author: "GeoDevz69",

  async execute(senderId, args, pageAccessToken) {
    try {
      const searchQuery = args.join(" ");
      if (!searchQuery) {
        return sendMessage(senderId, { text: "Usage: news <search text>" }, pageAccessToken);
      }

      const response = await axios.get(`https://betadash-api-swordslush-production.up.railway.app/news?q=${encodeURIComponent(searchQuery)}`);
      const result = response.data;

      if (!result || !result.title || !result.link) {
        return sendMessage(senderId, { text: "No news found for the given search query." }, pageAccessToken);
      }

      const title = result.title || "No title available";
      const link = result.link;

      const message = `📰 News Search Result:\n\n` +
                      `📝 Title: ${title}\n` +
                      `🔗 Link: ${link}`;

      await sendMessage(senderId, { text: message }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error.message);
      sendMessage(senderId, { text: "An error occurred while processing the request." }, pageAccessToken);
    }
  }
};
