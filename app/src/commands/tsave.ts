import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

module.exports = {
  name: 'tsave',
  description: 'Saves current template.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    let lastMsg: Discord.Message;
    try {
      lastMsg = await msgClient.channel.send('Saving template...');
      if (content.trim() === '') {
        await lastMsg.edit(`Failed to save. Please provide a label.`);
        return
      }
      const template = builderInstance.saveTemplate(content.trim());
      if (template)
        await lastMsg.edit(`Saved Template: ${template.label}`);
      else
        await lastMsg.edit(`Failed to save template. Possible duplicate label: \`${content.trim()}\``)
    } catch  {
      await lastMsg.edit(`Failed to get saved templates.`);
    }
  }
};
