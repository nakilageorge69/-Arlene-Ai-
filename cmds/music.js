const axios = require("axios");
const { sendMessage } = require("../handles/message");

console.log("sendMessage function:", sendMessage); 

module.exports = {
  name: "music",
  description: "YouTube mp3 search",
  role: 1,
  author: "mark",

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(" ");

    if (!prompt) {
      return sendMessage(senderId, {
        text: `Usage: yts [title] \n Example: yts glue song`
      }, pageAccessToken);
    }

    try {
      const apiUrl = `https://zen-api.up.railway.app/api/search?query=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const { title, downloadUrl } = response.data.items;

      console.log("Sending message with API URL:", apiUrl); 
      
      await sendMessage(senderId, {
        text: ` Title : ${title} \n Download url ${downloadUrl}\n`
      }, pageAccessToken);
      
 
      await sendMessage(senderId, {
        attachment: {
          type: "audio",
          payload: {
            url: downloadUrl
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
