import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

module.exports = {
  name: 'rm-url',
  description: 'Removes url from embed.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      builderInstance.removeUrl();
      await builderInstance.showEmbed(msgClient);
    } catch (err) {
      await msgClient.channel.send(`Failed to preview new embed`);
    }
  }
};
