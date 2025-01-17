const axios = require("axios");
const { sendMessage } = require("../handles/message");

console.log("sendMessage function:", sendMessage); 

module.exports = {
  name: "ytdl",
  description: "YouTube downloader",
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
      const apiUrl = `https://yt-video-production.up.railway.app/ytdlv3?url=${encodeURIComponent(prompt)}`;
      const response = await axios.get(apiUrl);
      const { success, download_url } = response.data;

      console.log("Sending message with API URL:", apiUrl); 
      
      await sendMessage(senderId, {
        text: ` response : ${description} \n`
      }, pageAccessToken);
      
 
      await sendMessage(senderId, {
        attachment: {
          type: "video",
          payload: {
            url: download_url
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
