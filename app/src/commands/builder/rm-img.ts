import * as Discord from 'discord.js';
import { EmbedBuilder } from '../../libs/embedBuilder';

module.exports = {
  name: 'rm-img',
  description: 'Removes image from embed.',
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      await msgClient.channel.send(builderInstance.removeImage());
    } catch (err) {
      if (err.name === 'DiscordAPIError') {
        await msgClient.channel.send(`Discord API Error: ${err.message}`);
      } else {
        await msgClient.channel.send(`Failed to preview new embed`);
      }
    }
  }
};
