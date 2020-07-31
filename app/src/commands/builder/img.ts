import * as Discord from 'discord.js';
import { EmbedBuilder } from '../../libs/embedBuilder';
import { getImageInput } from '../../libs/helpers';

module.exports = {
  name: 'img',
  description: 'Adds image to embed.',
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    const prevImage = builderInstance.currentEmbed.image?.url;

    try {
      const input = await getImageInput(msgClient);
      if (input) {
        await msgClient.channel.send(builderInstance.addImage(input));
      }
    } catch (err) {
      prevImage
        ? builderInstance.addImage(prevImage)
        : builderInstance.removeImage();
      if (err.name === 'DiscordAPIError') {
        await msgClient.channel.send(`Discord API Error: ${err.message}`);
      } else {
        await msgClient.channel.send(`Failed to add image!`);
      }
    }
  }
};
