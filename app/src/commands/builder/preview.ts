import * as Discord from 'discord.js';
import { EmbedBuilder } from '../../libs/embedBuilder';

module.exports = {
  name: 'preview',
  description: 'Previews current embed.',
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    await msgClient.channel.send(builderInstance.currentEmbed);
  }
};
