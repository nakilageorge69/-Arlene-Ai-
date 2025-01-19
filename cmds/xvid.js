const axios = require("axios");
const { sendMessage } = require("../handles/message");

console.log("sendMessage function:", sendMessage); 

module.exports = {
  name: "xvid",
  description: "xvideos downloader",
  role: 1,
  author: "mark",

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(" ");

    if (!prompt) {
      return sendMessage(senderId, {
        text: `Usage: xvid url`
      }, pageAccessToken);
    }

    try {
      const apiUrl = `https://apis-markdevs69v2.onrender.com/new/xnxx/download?url=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const { Default_Quality } = response.data;

      console.log("Sending message with API URL:", apiUrl); 
      
      await sendMessage(senderId, {
        text: ` 
        Title : ${Default_Quality}\n
        
        Download url ${Default_Quality}\n`
      }, pageAccessToken);
      
 
      await sendMessage(senderId, {
        attachment: {
          type: "video",
          payload: {
            url: Default_Quality
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
