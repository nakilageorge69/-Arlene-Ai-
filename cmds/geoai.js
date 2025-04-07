const axios = require('axios');
const { sendMessage } = require('../handles/message');

module.exports = {
  name: 'geoai',
  description: 'Ask a question to the Blackbox AI',
  role: 1,
  author: 'Mark Martinez and GeoDevz69',

  async execute(senderId, args, pageAccessToken) {
    const prompt = args.join(' ').trim();

    
    if (!prompt) {
      return sendMessage(senderId, {
        text: 'Hello! I am GPT4 Ai, how can I help you?'
      }, pageAccessToken);
    }

    const apiUrl = `https://kaiz-apis.gleeze.com/api/gpt-4o-pro?ask=hi&uid=1&imageUrl=${encodeURIComponent(prompt)}`;

    try {
      const response = await axios.get(apiUrl);
      const reply = response.data.response;

      if (reply) {
        
        const formattedResponse = `GPT4-PRO AI:\n\n${reply}`;
        
        
        const maxLength = 2000;

        
        if (formattedResponse.length > maxLength) {
          const chunks = [];
          let remainingText = formattedResponse;

          while (remainingText.length > 0) {
            chunks.push(remainingText.substring(0, maxLength));
            remainingText = remainingText.substring(maxLength);
          }

          
          for (const chunk of chunks) {
            await sendMessage(senderId, { text: chunk }, pageAccessToken);
          }
        } else {
          
          await sendMessage(senderId, { text: formattedResponse }, pageAccessToken);
        }
      } else {
        
        await sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
      }
    } catch (error) {
      console.error('Error calling Blackbox API:', error);

      
      await sendMessage(senderId, { text: 'Sorry, there was an error processing your request.' }, pageAccessToken);
    }
  }
};
