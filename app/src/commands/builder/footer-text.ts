import * as Discord from 'discord.js';
import { EmbedBuilder } from '../../libs/embedBuilder';

module.exports = {
  name: 'footer-text',
  description: 'Changes footer text of embed.',
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      await msgClient.channel.send(builderInstance.setFooterText(content));
    } catch (err) {
      builderInstance.currentEmbed.footer.text =
        builderInstance.defaults.footer.text;
      if (err.name === 'DiscordAPIError') {
        await msgClient.channel.send(`Discord API Error: ${err.message}`);
      } else {
        await msgClient.channel.send(`Failed to add footer text!`);
      }
    }
  }
};
