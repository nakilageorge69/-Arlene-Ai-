const axios = require("axios");
const { sendMessage } = require('../handles/message');

module.exports = {
  name: "newsupdate",
  description: "Search for news articles",
  role: 1,
  author: "GeoDevz69",

  async execute(senderId, args, pageAccessToken) {
    try {
      const searchQuery = args.join(" ");
      if (!searchQuery) {
        return sendMessage(senderId, { text: "Usage: tiksearch <search text>" }, pageAccessToken);
      }

      const response = await axios.get(`https://betadash-api-swordslush-production.up.railway.app/news?q=${encodeURIComponent(searchQuery)}`);
      const data = response.data;

      // Check if data is an array of articles
      const article = Array.isArray(data.articles) ? data.articles[0] : data;

      if (!article || !article.title || !article.link) {
        return sendMessage(senderId, { text: "No result found for the given search query." }, pageAccessToken);
      }

      const message = `📰 News Search Result:\n\n📝 Title: ${article.title}\n🔗 Link: ${article.link}`;

      await sendMessage(senderId, { text: message }, pageAccessToken);

    } catch (error) {
      console.error('Error:', error.message);
      await sendMessage(senderId, { text: "An error occurred while processing the request." }, pageAccessToken);
    }
  }
};
