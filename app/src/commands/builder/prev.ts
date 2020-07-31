import * as Discord from 'discord.js';
import { EmbedBuilder } from '../../libs/embedBuilder';

module.exports = {
  name: 'prev',
  description:
    'Cycles to previous embed. Use prev again to restore current embed',
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    if (builderInstance.previousEmbed === undefined) {
      await msgClient.channel.send('No previous embed to preview.');
      return;
    }
    builderInstance.displayedEmbed = await msgClient.channel.send(
      builderInstance.previousEmbed
    );
  }
};
