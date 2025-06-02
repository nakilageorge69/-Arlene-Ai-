const axios = require('axios');
const { APIs } = require ('../api');
const { sendMessage } = require('../handles/sendMessage');

module.exports = {
  name: 'removebg',
  description: 'Remove background from an image.',
  category: 'Tools',
  usage: 'Send an image, then type "removebg".',
  author: 'Kaizenji',

  async execute(senderId, args, pageAccessToken, imageUrl = null) {
    if (!imageUrl) {
      await sendMessage(senderId, { text: '[ ℹ️ ] 𝖴𝗌𝖺𝗀𝖾: 𝖯𝗅𝖾𝖺𝗌𝖾 𝗌𝖾𝗇𝖽 𝖺𝗇 𝗂𝗆𝖺𝗀𝖾 𝖿𝗂𝗋𝗌𝗍, 𝗍𝗁𝖾𝗇 𝗍𝗒𝗉𝖾 "𝗋𝖾𝗆𝗈𝗏𝖾𝖻𝗀" 𝗍𝗈 𝗋𝖾𝗆𝗈𝗏𝖾 𝗍𝗁𝖾 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽.' }, pageAccessToken);
      return;
    }

    await sendMessage(senderId, { text: '[ ⏳ ] 𝖱𝖾𝗆𝗈𝗏𝗂𝗇𝗀 𝖻𝖺𝖼𝗄𝗀𝗋𝗈𝗎𝗇𝖽, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...' }, pageAccessToken);

    try {
      const apiUrl = `${APIs.kaiz}/api/removebgv2?url=${encodeURIComponent(imageUrl)}&stream=true&apikey=${APIs.kaizapikey}`;

      const uploadApiUrl = `${APIs.imgur}/imgur?url=${encodeURIComponent(apiUrl)}`;
      const response = await axios.get(uploadApiUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'application/json',
        }
      });

      const imgurData = response.data;

      if (imgurData.uploaded && imgurData.uploaded.status === 'success') {
        const imgurLink = imgurData.uploaded.image;
        
        await sendMessage(senderId, {
          attachment: {
            type: 'image',
            payload: { url: imgurLink }
          }
        }, pageAccessToken);
      } else {
        throw new Error('Imgur upload failed');
      }

    } catch (error) {
  console.error('Error message:', error.message);
  const statusCode = error.response?.status || 'Unknown';
  await sendMessage(senderId, {
    text: `[ ❌ ] 𝖤𝗋𝗋𝗈𝗋: 𝖠𝖯𝖨 𝗋𝖾𝗊𝗎𝖾𝗌𝗍 𝖿𝖺𝗂𝗅𝖾𝖽. 𝖲𝗍𝖺𝗍𝗎𝗌 𝖢𝗈𝖽𝖾: ${statusCode}\n𝖯𝗅𝖾𝖺𝗌𝖾 𝖼𝗈𝗇𝗍𝖺𝖼𝗍 𝗍𝗁𝖾 𝖽𝖾𝗏𝖾𝗅𝗈𝗉𝖾𝗋.`
  }, pageAccessToken);
}
}
};
