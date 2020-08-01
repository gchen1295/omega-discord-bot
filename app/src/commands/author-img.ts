import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';
import { getImageInput } from '../libs/helpers';

module.exports = {
  name: 'author-img',
  description: 'Changes author image of embed.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      const input = await getImageInput(msgClient);
      if (input) {
        builderInstance.setAuthorImage(content);
        await builderInstance.showEmbed(msgClient);
      }
    } catch (err) {
      builderInstance.currentEmbed.author.iconURL =
        builderInstance.defaults.author.iconURL;
      await msgClient.channel.send(`Failed to add author image!`);
    }
  }
};
