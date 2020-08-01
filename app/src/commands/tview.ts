import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

const renderView = async (msgClient: Discord.Message, message: Discord.Message, templates: { label: string, template: Discord.MessageEmbed }[], activePage: number, templatesStored: number) => {
  const activeButtons = [];
  const templateView = await message.edit({ content: `**Template: ${templates[activePage].label}**`, embed: templates[activePage].template });
  await message.reactions.removeAll();

  if (activePage > 0) {
    await templateView.react('⬅️');
    activeButtons.push('⬅️');
  }

  if (activePage < templatesStored - 1) {
    await templateView.react('➡️');
    activeButtons.push('➡️');
  }
  await templateView.react('❌');
  activeButtons.push('❌');

  const pgInputs = await templateView.awaitReactions((reaction, user) => (user.id === msgClient.author.id && activeButtons.includes(reaction.emoji.name)), { max: 1, time: 120000 });
  const input = pgInputs.first().emoji.name;
  if (input === '❌') {
    await message.reactions.removeAll();
    return
  }
  if (input === '⬅️') {
    renderView(msgClient, message, templates, activePage - 1, templatesStored);
  } else if (input === '➡️') {
    renderView(msgClient, message, templates, activePage + 1, templatesStored);
  }
}

module.exports = {
  name: 'tview',
  description: 'Shows all stored templates.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    const viewEmbed = new Discord.MessageEmbed();
    viewEmbed.setAuthor('Saved Templates');
    let templateView: Discord.Message;
    try {
      templateView = await msgClient.channel.send(viewEmbed);
      const savedTemplates = builderInstance.getTemplates();
      if (savedTemplates) {
        if (savedTemplates.length > 0) {
          renderView(msgClient, templateView, savedTemplates, 0, savedTemplates.length);
          return;
        } else {
          viewEmbed.setTitle('No saved templates.');
          await templateView.edit(viewEmbed);
          return;
        }
      }
      viewEmbed.setTitle('Failed to get saved templates.');
      await templateView.edit(viewEmbed);
      return;

    } catch (err) {
      await msgClient.channel.send(`Failed to get saved templates.`);
    }
  }
};
