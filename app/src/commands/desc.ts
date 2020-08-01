import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

module.exports = {
  name: 'desc',
  description: 'Add description to embed.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    const prevDescription = builderInstance.currentEmbed.description;
    try {
      builderInstance.addDescription(content);
      await builderInstance.showEmbed(msgClient);
    } catch (err) {
      prevDescription
        ? builderInstance.addDescription(prevDescription)
        : builderInstance.removeDescription();

      await msgClient.channel.send(`Failed to add description!`);
    }
  }
};
