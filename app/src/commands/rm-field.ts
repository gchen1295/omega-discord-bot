import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';
import { getInput } from '../libs/helpers';

module.exports = {
  name: 'rm-field',
  description: 'Removes field(s) from current embed.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    let displayMsg: Discord.Message;
    try {
      const embedFields = builderInstance.currentEmbed.fields;
      let msg = '';
      for (let i = 0; i < embedFields.length; i += 1) {
        msg += `\`\`\`Field #${(i += 1)}\nname: ${embedFields[i].name}\nvalue: ${
          embedFields[i].value
          }\ninline: ${embedFields[i].inline}\`\`\`\n`;

      }
      msg += 'Which fields to remove? (Comma separated list for multiple fields)'
      displayMsg = await msgClient.channel.send(msg);

      const fieldsInput = await getInput(msgClient);
      await displayMsg.edit('Removing fields...');
      const fields = fieldsInput.split(',');
      const sortedIndexes = [];
      const currentFieldsLength = builderInstance.currentEmbed.fields.length;
      for (const index of fields) {
        const parsedIndex = parseInt(index, 10);
        if (isNaN(parsedIndex)) break;
        if (
          parsedIndex <= currentFieldsLength &&
          !sortedIndexes.includes(index)
        )
          sortedIndexes.push(parsedIndex - 1);
      }
      sortedIndexes.sort((a: number, b: number) => a - b);
      for (const i of sortedIndexes) {
        builderInstance.currentEmbed.fields.splice(i, 1);
      }
      await displayMsg.delete();

      await builderInstance.showEmbed(msgClient);
    } catch (err) {
      await displayMsg.delete();
      await msgClient.channel.send(`Failed to preview new embed`);
    }
  }
};
