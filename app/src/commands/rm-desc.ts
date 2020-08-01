import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

module.exports = {
  name: 'rm-desc',
  description: 'Removes description from embed.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      builderInstance.removeDescription();
      await builderInstance.showEmbed(msgClient);
    } catch (err) {
      await msgClient.channel.send(`Failed to preview new embed`);
    }
  }
};
