import * as Discord from 'discord.js';
import { EmbedBuilder } from '../../libs/embedBuilder';
import { getImageInput } from '../../libs/helpers';

module.exports = {
  name: 'field',
  description: 'Needs work',
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      await msgClient.channel.send(builderInstance.removeUrl());
    } catch (err) {
      if (err.name === 'DiscordAPIError') {
        await msgClient.channel.send(`Discord API Error: ${err.message}`);
      } else {
        await msgClient.channel.send(`Failed to preview new embed`);
      }
    }
  }
};
