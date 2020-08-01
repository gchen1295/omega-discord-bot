import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

module.exports = {
  name: 'prev',
  description:
    'Cycles to previous embed. Use prev again to restore current embed',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      if (builderInstance.swapPrevious()) {
        builderInstance.showEmbed(msgClient);
        return;
      }
      await msgClient.channel.send('No previous embed to preview.');
    } catch {
      await msgClient.channel.send(`Failed to pull previous embed!`);
    }
  }
};
