import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

module.exports = {
  name: 'rm-title',
  description: 'Removes title from embed',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      builderInstance.removeTitle();
      await builderInstance.showEmbed(msgClient);
    } catch (err) {
      await msgClient.channel.send(`Failed to preview new embed`);
    }
  }
};
