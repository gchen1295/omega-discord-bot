import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

module.exports = {
  name: 'url',
  description: 'Adds url to embed.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    const prevURL = builderInstance.currentEmbed.url;
    try {
      builderInstance.addUrl(content);
      await builderInstance.showEmbed(msgClient);
    } catch (err) {
      prevURL ? builderInstance.addUrl(prevURL) : builderInstance.removeUrl();
      await msgClient.channel.send(`Failed to add URL!`);
    }
  }
};
