import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

module.exports = {
  name: 'author-name',
  description: 'Changes author name of embed.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      builderInstance.setAuthorName(content);
      await builderInstance.showEmbed(msgClient);
    } catch (err) {
      builderInstance.currentEmbed.author.name =
        builderInstance.defaults.author.name;
      await msgClient.channel.send(`Failed to add author name!`);
    }
  }
};
