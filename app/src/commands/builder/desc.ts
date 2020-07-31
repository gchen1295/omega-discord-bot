import * as Discord from 'discord.js';
import { EmbedBuilder } from '../../libs/embedBuilder';

module.exports = {
  name: 'desc',
  description: 'Add description to embed.',
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    const prevDescription = builderInstance.currentEmbed.description;
    try {
      await msgClient.channel.send(builderInstance.addDescription(content));
    } catch (err) {
      prevDescription
        ? builderInstance.addDescription(prevDescription)
        : builderInstance.removeDescription();
      if (err.name === 'DiscordAPIError') {
        await msgClient.channel.send(`Discord API Error: ${err.message}`);
      } else {
        await msgClient.channel.send(`Failed to add description!`);
      }
    }
  }
};
