const axios = require('axios');
const { sendMessage } = require('../handles/message');

module.exports = {
  name: "shoti",
  description: "Send a random shoti video",
  author: "mark",
  //yeyy working sya

  async execute(senderId, args, pageAccessToken) {
    try {
      const response = await axios.get('https://random-use-api-production.up.railway.app/shoti');
      const { url: url, name, description } = response.data;

      await sendMessage(senderId, {
        text: `Username: ${name}\ndescription: ${description}\nOwner: GeoDevz69`
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
      console.error("Failed to fetch the Chilli video:", error);
      sendMessage(senderId, {
        text: `Failed to fetch the Chilli video. Error: ${error.message || "Unknown error"}`
      }, pageAccessToken);
    }
  }
};
