import * as Discord from 'discord.js';
import { EmbedBuilder } from '../../libs/embedBuilder';

module.exports = {
  name: 'new',
  description: 'Creates a new embed',
  async execute(
    msgClient: Discord.Message,
    contents: string,
    builderInstance: EmbedBuilder
  ) {
    builderInstance.newEmbed();
    builderInstance.displayedEmbed = await msgClient.channel.send(
      builderInstance.addDescription('New Embed')
    );
    builderInstance.currentEmbed.description = '';
  }
};
