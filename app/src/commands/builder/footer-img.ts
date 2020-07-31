import * as Discord from 'discord.js';
import { EmbedBuilder } from '../../libs/embedBuilder';
import { getImageInput } from '../../libs/helpers';

module.exports = {
  name: 'footer-img',
  description: 'Changes footer image of embed.',
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      const input = await getImageInput(msgClient);
      if (input) {
        await msgClient.channel.send(builderInstance.setFooterImage(input));
      }
    } catch (err) {
      builderInstance.currentEmbed.footer.iconURL =
        builderInstance.defaults.footer.iconURL;
      if (err.name === 'DiscordAPIError') {
        await msgClient.channel.send(`Discord API Error: ${err.message}`);
      } else {
        await msgClient.channel.send(`Failed to add footer image!`);
      }
    }
  }
};
