import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

module.exports = {
  name: 'whdelete',
  description: 'Deletes saved webhook.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    let displayMsg: Discord.Message;
    try {
      displayMsg = await msgClient.channel.send(`Deleting Webhook: \`${content.trim()}\``)
      if (builderInstance.deleteWebhook(content.trim())) {
        displayMsg.edit(`Deleted webhook: \`${content.trim()}\``);
        return;
      }
      displayMsg.edit('Failed to delete webhook.');
      return;
    } catch (err) {
      await msgClient.channel.send(`Failed to add webhook.`);
    }
  }
};
