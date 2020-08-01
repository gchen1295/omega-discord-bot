import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';
import { getInput } from '../libs/helpers';

module.exports = {
  name: 'field',
  description: 'Adds non-inline field. Will prompt for inputs for name and value.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    let lastSent: Discord.Message;
    try {
      lastSent = await msgClient.channel.send('Enter field name:');
      const nameInput = await getInput(msgClient);
      await lastSent.edit('Enter field value:');
      const valueInput = await getInput(msgClient);
      await lastSent.delete();
      if (builderInstance.addField(nameInput, valueInput, false)) {
        await builderInstance.showEmbed(msgClient);
      } else {
        await msgClient.channel.send(`Max fields reached!`);
      }

    } catch (err) {
      if (lastSent) await lastSent.edit(`Failed to add field!`);
      else await msgClient.channel.send(`Failed to add field!`);
    }
  }
};
