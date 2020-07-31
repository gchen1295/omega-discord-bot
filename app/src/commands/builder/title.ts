import * as Discord from 'discord.js';
import { EmbedBuilder } from '../../libs/embedBuilder';

module.exports = {
  name: 'title',
  description: 'Adds title to embed',
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    const prevTitle = builderInstance.currentEmbed.title;
    try {
      await msgClient.channel.send(builderInstance.addTitle(content));
    } catch (err) {
      prevTitle
        ? builderInstance.addTitle(prevTitle)
        : builderInstance.removeTitle();
      if (err.name === 'DiscordAPIError') {
        await msgClient.channel.send(`Discord API Error: ${err.message}`);
      } else {
        await msgClient.channel.send(`Failed to add title!`);
      }
    }
  }
};
