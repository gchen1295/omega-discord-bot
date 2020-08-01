import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

module.exports = {
  name: 'footer-text',
  description: 'Changes footer text of embed.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      builderInstance.setFooterText(content);
      await builderInstance.showEmbed(msgClient);
    } catch (err) {
      builderInstance.currentEmbed.footer.text =
        builderInstance.defaults.footer.text;
      await msgClient.channel.send(`Failed to add footer text!`);
    }
  }
};
