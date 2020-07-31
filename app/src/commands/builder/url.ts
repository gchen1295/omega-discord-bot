import * as Discord from 'discord.js';
import { EmbedBuilder } from '../../libs/embedBuilder';

module.exports = {
  name: 'url',
  description: 'Adds url to embed.',
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    const prevURL = builderInstance.currentEmbed.url;
    try {
      await msgClient.channel.send(builderInstance.addUrl(content));
    } catch (err) {
      prevURL ? builderInstance.addUrl(prevURL) : builderInstance.removeUrl();
      if (err.name === 'DiscordAPIError') {
        await msgClient.channel.send(`Discord API Error: ${err.message}`);
      } else {
        await msgClient.channel.send(`Failed to add URL!`);
      }
    }
  }
};
