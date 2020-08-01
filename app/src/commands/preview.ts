import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';
// If you're reading this I love you

module.exports = {
  name: 'preview',
  description: 'Generates new preview of current embed.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      builderInstance.displayedEmbed = void 0;
      await builderInstance.showEmbed(msgClient);
    } catch {
      await msgClient.channel.send(`Failed to get new preview.`);
    }
  }
};
