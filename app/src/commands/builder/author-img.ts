import * as Discord from 'discord.js';
import { EmbedBuilder } from '../../libs/embedBuilder';
import { getImageInput } from '../../libs/helpers';

module.exports = {
  name: 'author-img',
  description: 'Changes author image of embed.',
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      const input = await getImageInput(msgClient);
      if (input) {
        await msgClient.channel.send(builderInstance.setAuthorImage(content));
      }
    } catch (err) {
      builderInstance.currentEmbed.author.iconURL =
        builderInstance.defaults.author.iconURL;
      if (err.name === 'DiscordAPIError') {
        await msgClient.channel.send(`Discord API Error: ${err.message}`);
      } else {
        await msgClient.channel.send(`Failed to add author image!`);
      }
    }
  }
};
