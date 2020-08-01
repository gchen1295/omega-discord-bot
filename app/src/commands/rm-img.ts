import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

module.exports = {
  name: 'rm-img',
  description: 'Removes image from embed.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      builderInstance.removeImage();
      await builderInstance.showEmbed(msgClient);
    } catch (err) {
      await msgClient.channel.send(`Failed to preview new embed`);
    }
  }
};
