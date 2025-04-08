const axios = require("axios");
const { sendMessage } = require("../handles/message");

console.log("sendMessage function:", sendMessage); 

module.exports = {
  name: "ytmp4",
  description: "YouTube downloader using URL",
  role: 1,
  author: "mark",

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(" ");

    if (!prompt) {
      return sendMessage(senderId, {
        text: `Usage: ytdl [ URL ]`
      }, pageAccessToken);
    }

    try {
      const apiUrl = `https://zen-api.up.railway.app/api/search?query=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const { title, video } = response.data;

      console.log("Sending message with API URL:", apiUrl); 
      
      await sendMessage(senderId, {
        text: ` title : ${title} \n`
      }, pageAccessToken);
      
 
      await sendMessage(senderId, {
        attachment: {
          type: "video",
          payload: {
            url: video
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error("error pa fix kay owner:", error);
      sendMessage(senderId, {
        text: `error pa fix kay owner. Please try again or check your input.`
      }, pageAccessToken);
    }
  }
};
