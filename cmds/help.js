const fs = require('fs');
const path = require('path');
const { sendMessage } = require('../handles/message');

module.exports = {
  name: 'help',
  description: 'Show available commands with descriptions',
  role: 1,
  author: 'GeoDevz69 fix by Mark Martinez',

  async execute(senderId, args, pageAccessToken) {
    const commandsDir = path.join(__dirname, '../cmds');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    const commands = commandFiles.map((file) => {
      const command = require(path.join(commandsDir, file));
      return {
        title: `⌬ ${command.name.charAt(0).toUpperCase() + command.name.slice(1)}`,
        description: command.description,
      };
    });

    const totalCommands = commands.length;
    const commandsPerPage = 5;
    const totalPages = Math.ceil(totalCommands / commandsPerPage);

    // If user typed "help all"
    if (args[0]?.toLowerCase() === 'all') {
      for (let i = 0; i < totalPages; i++) {
        const pageCommands = commands.slice(i * commandsPerPage, (i + 1) * commandsPerPage);

        const messageText =
          `╭─❍「 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 」\n│ » Page View : [ ${i + 1}/${totalPages} ]\n│ » Total Commands : [ ${totalCommands} ]\n│` +
          pageCommands.map((cmd, index) =>
            `\n│ ${i * commandsPerPage + index + 1}. ${cmd.title}\n│ ○ ${cmd.description}`
          ).join('') +
          `\n╰────────────⧕\n\n├─────☾⋆\n│ » Use "help [page]" to jump to a specific page\n│ » Or "help all" to read all pages again\n╰────────────⧕`;

        // Wait between pages to avoid Facebook limits
        await delay(i * 1500); // 1.5s between pages
        sendMessage(senderId, { text: messageText }, pageAccessToken);
      }
      return;
    }

    // Default single-page help
    let page = parseInt(args[0]) || 1;
    if (page < 1) page = 1;
    const startIndex = (page - 1) * commandsPerPage;
    const pageCommands = commands.slice(startIndex, startIndex + commandsPerPage);

    if (!pageCommands.length) {
      return sendMessage(senderId, {
        text: `❌ Page ${page} not found. Total pages: ${totalPages}.`,
      }, pageAccessToken);
    }

    const messageText =
      `╭─❍「 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 」\n│ » Page View : [ ${page}/${totalPages} ]\n│ » Total Commands : [ ${totalCommands} ]\n│` +
      pageCommands.map((cmd, index) =>
        `\n│ ${startIndex + index + 1}. ${cmd.title}\n│ ○ ${cmd.description}`
      ).join('') +
      `\n╰────────────⧕\n\n├─────☾⋆\n│ » Use "help [page]" to switch pages\n│ » Or "help all" to see all commands\n╰────────────⧕`;

    sendMessage(senderId, { text: messageText }, pageAccessToken);
  }
};

// Add delay helper
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
