const axios = require("axios");
const { sendMessage } = require('../handles/message'); // Ensure the path is correct

module.exports = {
  name: "spotify",
  description: "Search for a Spotify track using a keyword",
  role: 1,
  author: "developer",

  async execute(senderId, args, pageAccessToken) {
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      return sendMessage(senderId, {
        text: `Usage: spotify [music title]`
      }, pageAccessToken);
    }

    try {
      const res = await axios.get('https://kaiz-apis.gleeze.com/api/spotify-search?q=', {
        params: { search: searchQuery }
      });

      if (!res || !res.data || res.data.length === 0) {
        throw new Error("No results found");
      }

      const { name: trackName, download, image, track } = res.data[0];


      await sendMessage(senderId, {
        text: `🎶 Now playing: ${trackName}\n\n🔗 Spotify Link: ${track}`
      }, pageAccessToken);

 
      await sendMessage(senderId, {
        attachment: {
          type: "image",
          payload: {
            url: image
          }
        }
      }, pageAccessToken);


      await sendMessage(senderId, {
        attachment: {
          type: "audio",
          payload: {
            url: download
          }
        }
      }, pageAccessToken);

    } catch (error) {
      console.error("Error retrieving the Spotify track:", error);
      await sendMessage(senderId, {
        text: `Error retrieving the Spotify track. Please try again or check your input.`
      }, pageAccessToken);
    }
  }
};
