import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

module.exports = {
  name: 'tdelete',
  description: 'Deletes a template.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      if (content.trim() === '') {
        await msgClient.channel.send(`No template label provided.`);
        return
      }
      const lastMsg = await msgClient.channel.send(`Are you sure you want to delete \`${content}\`?`);
      await lastMsg.react('✅');
      await lastMsg.react('❌');
      lastMsg.awaitReactions((reaction, user) => user.id === msgClient.author.id && ['✅', '❌'].includes(reaction.emoji.name), { max: 1, time: 60000 }).then(
        async reaction => {
          await lastMsg.reactions.removeAll();
          if (reaction.first().emoji.name === '✅') {

            await lastMsg.edit(`Deleting Template: \`${content}\``);
            if (builderInstance.deleteTemplate(content.trim())) {
              await lastMsg.edit(`Deleted Template \`${content}\``);
            } else {
              await lastMsg.edit(`Failed to find a template with label \`${content}\``);
            }
          } else {
            await lastMsg.delete();
          }

        }
      )
    } catch (err) {
      await msgClient.channel.send(`Failed to delete template.`);
    }
  }
};
