import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';
import { getInput } from '../libs/helpers'

module.exports = {
  name: 'whadd',
  description: 'Add a new webhook.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    let displayMsg: Discord.Message;
    try {
      displayMsg = await msgClient.channel.send('Webhook Name?');
      const nameInput = await getInput(msgClient);
      displayMsg.edit('Webhook URL?');
      const urlInput = await getInput(msgClient);
      if (nameInput && urlInput) {
        const updatedWebhooks = builderInstance.addWebhook(nameInput, urlInput);

        if (updatedWebhooks) {
          displayMsg.edit(`Added new webhook.\n\`\`\`Label: ${nameInput}\nURL: ${urlInput}\`\`\``)
          return;
        }
        displayMsg.edit(`Failed to add webhook. Possible duplicate label \`${nameInput}\``);
        return;
      }
      return;
    } catch (err) {
      await msgClient.channel.send(`Failed to add webhook.`);
    }
  }
};
