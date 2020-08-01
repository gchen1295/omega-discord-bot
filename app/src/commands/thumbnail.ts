import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';
import { getImageInput } from '../libs/helpers';

module.exports = {
  name: 'thumbnail',
  description: 'Changes thumbnail image of embed.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      const input = await getImageInput(msgClient);
      if (input) {
        builderInstance.addThumbnail(input);
        await builderInstance.showEmbed(msgClient);
      }
    } catch (err) {
      builderInstance.currentEmbed.footer.iconURL =
        builderInstance.defaults.footer.iconURL;
      await msgClient.channel.send(`Failed to add thumbnail image!`);
    }
  }
};
