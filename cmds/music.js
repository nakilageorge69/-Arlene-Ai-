const axios = require("axios");
const { sendMessage } = require("../handles/message");

console.log("sendMessage function:", sendMessage); 

module.exports = {
  name: "music",
  description: "Music Search",
  role: 1,
  author: "GeoDevz69",

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(" ");

    if (!prompt) {
      return sendMessage(senderId, {
        text: `Usage: music [title] \n Example: music lihim song`
      }, pageAccessToken);
    }

    try {
      const apiUrl = `https://zen-api.up.railway.app/api/search?query=${encodeURIComponent(prompt)}`;

try {
  const response = await axios.get(apiUrl);
  const results = response.data.results;

  // For example, get the first result
  if (results.length > 0) {
    const { title, url } = results[0];

    console.log("Sending message with API URL:", apiUrl);
    console.log("Title:", title);
    console.log("URL:", url);
  } else {
    console.log("No results found.");
  }
} catch (error) {
  console.error("Error fetching search results:", error);
}

      
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
