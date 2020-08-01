import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

module.exports = {
  name: 'title',
  description: 'Adds title to embed',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    const prevTitle = builderInstance.currentEmbed.title;
    try {
      builderInstance.addTitle(content);
      await builderInstance.showEmbed(msgClient);
    } catch (err) {
      prevTitle
        ? builderInstance.addTitle(prevTitle)
        : builderInstance.removeTitle();
      await msgClient.channel.send(`Failed to add title!`);
    }
  }
};
