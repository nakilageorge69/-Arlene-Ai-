const axios = require("axios");
const { sendMessage } = require("../handles/message");

module.exports = {
  name: "removebg",
  description: "Removes background from an image.",
  role: 1,
  author: "GeoDevz69",

  async execute(bot, args, authToken, event) {
    if (!event?.sender?.id) {
      console.error("Missing sender ID.");
      sendMessage(bot, { text: "Error: Missing sender ID." }, authToken);
      return;
    }

    try {
      const imageUrl = await extractImageUrl(event, authToken);
      if (!imageUrl) {
        sendMessage(bot, { text: "No image found. Please reply to an image or send an image directly.😂" }, authToken);
        return;
      }

      // Updated API URL
      const apiUrl = `https://kaiz-apis.gleeze.com/api/removebg?url=${encodeURIComponent(imageUrl)}&stream=True&apikey=ec7d563d-adae-4048-af08-0a5252f336d1`;
      const response = await axios.get(apiUrl);

      const finalUrl = response.data?.url;
      if (finalUrl) {
        sendMessage(
          bot,
          {
            attachment: {
              type: "image",
              payload: {
                url: finalUrl
              }
            }
          },
          authToken
        );
      } else {
        sendMessage(bot, { text: "Failed to get processed image. Tanga ka." }, authToken);
      }
    } catch (err) {
      console.error("Removebg command error:", err);
      sendMessage(bot, { text: `Error: ${err.message || "Something went wrong."}` }, authToken);
    }
  }
};

async function extractImageUrl(event, authToken) {
  try {
    if (event.message.reply_to?.mid) {
      return await getRepliedImage(event.message.reply_to.mid, authToken);
    } else if (event.message?.attachments?.[0]?.type === "image") {
      return event.message.attachments[0].payload.url;
    }
  } catch (err) {
    console.error("Image extraction failed:", err);
  }
  return "";
}

async function getRepliedImage(mid, authToken) {
  try {
    const { data } = await axios.get(`https://graph.facebook.com/v21.0/${mid}/attachments`, {
      params: { access_token: authToken }
    });
    return data?.data[0]?.image_data?.url || "";
  } catch {
    throw new Error("Failed to retrieve replied image.");
  }
}
