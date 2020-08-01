import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';
import { getImageInput } from '../libs/helpers';

module.exports = {
  name: 'img',
  description: 'Adds image to embed.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    const prevImage = builderInstance.currentEmbed.image?.url;

    try {
      const input = await getImageInput(msgClient);
      if (input) {
        builderInstance.addImage(input);
        await builderInstance.showEmbed(msgClient);
      }
    } catch (err) {
      prevImage
        ? builderInstance.addImage(prevImage)
        : builderInstance.removeImage();
      await msgClient.channel.send(`Failed to add image!`);
    }
  }
};
