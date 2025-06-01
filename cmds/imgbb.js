const axios = require("axios");
const { sendMessage } = require('../handles/message');

module.exports = {
  name: "imgbb",
  description: "Uploads an image to imgbb.",
  role: 1,
  author: "GeoDevz69",

  async execute(bot, args, authToken, event) {
    if (!event?.sender?.id) {
      console.error('Invalid event object: Missing sender ID.');
      sendMessage(bot, { text: 'Error: Missing sender ID.' }, authToken);
      return;
    }

    try {
      const imageUrl = await extractImageUrl(event, authToken);

      if (!imageUrl) {
        sendMessage(bot, { text: "Please reply to an image or send an image with the command to upload it to imgbb." }, authToken);
        return;
      }

      const imgbbResponse = await uploadToImgbb(imageUrl);

      if (imgbbResponse?.success) {
        const imgbbLink = imgbbResponse.link;
        sendMessage(bot, { text: `Image uploaded to imgbb: ${imgbbLink}` }, authToken);
      } else {
        sendMessage(bot, { text: "Failed to upload the image to imgbb." }, authToken);
      }
    } catch (error) {
      console.error("Error in imgbb command:", error);
      sendMessage(bot, { text: `Error: ${error.message || "Something went wrong."}` }, authToken);
    }
  }
};

async function extractImageUrl(event, authToken) {
  try {
    if (event.message.reply_to?.mid) {
      return await getRepliedImage(event.message.reply_to.mid, authToken);
    }

    if (event.message?.attachments?.[0]?.type === 'image') {
      return event.message.attachments[0].payload.url;
    }
  } catch (error) {
    console.error("Failed to extract image URL:", error);
  }
  return "";
}

async function getRepliedImage(mid, authToken) {
  try {
    const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
      params: { access_token: authToken }
    });
    return data?.data[0]?.image_data?.url || "";
  } catch (error) {
    throw new Error("Failed to retrieve replied image.");
  }
}

async function uploadToImgbb(imageUrl) {
  try {
    const apiUrl = `https://kaiz-apis.gleeze.com/api/imgbb?url=${encodeURIComponent(imageUrl)}`;
    const { data } = await axios.get(apiUrl);
    return data;
  } catch (error) {
    console.error("Failed to upload to imgbb:", error);
    return null;
  }
}
