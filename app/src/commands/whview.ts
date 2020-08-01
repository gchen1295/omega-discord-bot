import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

const renderView = async (msgClient: Discord.Message, message: Discord.Message, pages: { label: string, webhook: string }[][], activePage: number, numPages: number) => {
  const activeButtons = [];
  const pageEmbed = new Discord.MessageEmbed();
  pageEmbed.setTitle(`Webhooks List - Page ${activePage + 1}`);
  let pageData = '```\n';
  for (const webhookData of pages[activePage]) {
    pageData += `Label: ${webhookData.label}\nURL: ${webhookData.webhook}\n=======================================\n`;
  }
  pageData += '```';
  pageEmbed.setDescription(pageData);
  const templateView = await message.edit(pageEmbed);
  await message.reactions.removeAll();

  if (activePage > 0) {
    await templateView.react('⬅️');
    activeButtons.push('⬅️');
  }

  if (activePage < numPages - 1) {
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
    renderView(msgClient, message, pages, activePage - 1, numPages);
  } else if (input === '➡️') {
    renderView(msgClient, message, pages, activePage + 1, numPages);
  }
}

const chunk = (arr: { label: string, webhook: string }[], size: number) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

module.exports = {
  name: 'whview',
  description: 'Shows all stored webhooks.',
  adminOnly: true,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    const viewEmbed = new Discord.MessageEmbed();
    viewEmbed.setAuthor('Saved Webhooks');
    let listView: Discord.Message;
    try {
      listView = await msgClient.channel.send(viewEmbed);
      const savedWebhooks = builderInstance.getWebhooks();
      console.log(savedWebhooks);
      if (savedWebhooks) {
        if (savedWebhooks.length > 0) {
          const chunkedWebhooks = chunk(savedWebhooks, 10);
          const numPages = chunkedWebhooks.length;
          renderView(msgClient, listView, chunkedWebhooks, 0, numPages);
          return;
        } else {
          viewEmbed.setTitle('No saved webhooks.');
          await listView.edit(viewEmbed);
          return;
        }
      }
      viewEmbed.setTitle('Failed to get saved webhooks.');
      await listView.edit(viewEmbed);
      return;

    } catch (err) {
      console.log(err);
      await msgClient.channel.send(`Error getting saved webhooks.`);
    }
  }
};
