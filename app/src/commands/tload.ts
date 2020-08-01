import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

module.exports = {
  name: 'tload',
  description: 'Loads a template.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    let lastMsg: Discord.Message;
    try {
      lastMsg = await msgClient.channel.send(`Loading template \`${content.trim()}\`...`);
      if (content.trim() === '') {
        await lastMsg.edit(`Please provide a label.`);
        return
      }
      const template = builderInstance.loadTemplate(content.trim());
      if (template)
        await lastMsg.edit({ content: `Loaded Template: ${content.trim()}`, embed: template });
      else
        await lastMsg.edit(`Failed to load template: \`${content.trim()}\``)
    } catch (err) {
      await lastMsg.edit(`Failed to load templates.`);
    }
  }
};
