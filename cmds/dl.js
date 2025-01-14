const axios = require("axios");
const { sendMessage } = require("../handles/message");

console.log("sendMessage function:", sendMessage); 

module.exports = {
  name: "dl",
  description: "URL Downloader",
  role: 1,
  author: "mark",

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(" ");

    if (!prompt) {
      return sendMessage(senderId, {
        text: `Usage: dl [ URL ]`
      }, pageAccessToken);
    }

    try {
      
      const apiUrl = `https://downloader-api-9kp1.onrender.com/api/getinfo?url=${encodeURIComponent(prompt)}`;
      const { url: url, name, } = response.data;

      console.log("Sending message with API URL:", apiUrl); 
      
      await sendMessage(senderId, {
        text: ` Name : ${name} \n`
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
      console.error("error pa fix kay owner:", error);
      sendMessage(senderId, {
        text: `error pa fix kay owner. Please try again or check your input.`
      }, pageAccessToken);
    }
  }
};
