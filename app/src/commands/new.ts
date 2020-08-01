import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

module.exports = {
  name: 'new',
  description: 'Creates a new embed',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    contents: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      builderInstance.newEmbed();
      console.log(builderInstance.currentEmbed);
      builderInstance.addDescription('New Embed');
      await builderInstance.showEmbed(msgClient);
      builderInstance.currentEmbed.description = '';
    } catch{
      msgClient.channel.send(`Failed to create new embed!`);
    }
  }
};
