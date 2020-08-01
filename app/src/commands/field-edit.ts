import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';
import { getInput } from '../libs/helpers';


module.exports = {
  name: 'field-edit',
  description: 'Edits field from current embed.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    let displayMsg: Discord.Message;
    try {
      const embedFields = builderInstance.currentEmbed.fields;
      let embedCopy = Object.assign({}, builderInstance.currentEmbed);
      let msg = '';
      for (let i = 0; i < embedFields.length; i += 1) {
        // msg += `\`\`\`Field #${(i += 1)}\nname: ${embedFields[i].name}\nvalue: ${
        //   embedFields[i].value
        //   }\ninline: ${embedFields[i].inline}\`\`\`\n`;
        embedCopy.fields[i].name = `Field #${i + 1}`;
      }
      // msg += 'Which field to edit?'
      displayMsg = await msgClient.channel.send({ content: 'Which number field to edit?', embed: embedCopy });


      let input = await getInput(msgClient);
      await displayMsg.delete();
      const fieldNum = parseInt(input.trim());
      if (isNaN(fieldNum)) {
        displayMsg = await msgClient.channel.send('Not a valid field number!');
        return
      }
      console.log(embedFields.length)
      if ((fieldNum > embedFields.length) && fieldNum < 1) {
        displayMsg = await msgClient.channel.send(`Invalid index: ${fieldNum}`);
        return
      }
      displayMsg = await msgClient.channel.send('`name` OR `value` OR `inline`');

      input = (await getInput(msgClient)).trim().toLowerCase();
      if (input === 'name') {
        await displayMsg.edit('**Input new name:**');
        input = (await getInput(msgClient)).trim();
        builderInstance.currentEmbed.fields[fieldNum - 1].name = input;
        await displayMsg.delete();
        await builderInstance.showEmbed(msgClient);
      } else if (input === 'value') {
        await displayMsg.edit('**Input new value:**');
        input = (await getInput(msgClient)).trim();
        builderInstance.currentEmbed.fields[fieldNum - 1].value = input;
        await displayMsg.delete();
        await builderInstance.showEmbed(msgClient);
      } else if (input === 'inline') {
        await displayMsg.edit('`true` OR `false`');
        input = (await getInput(msgClient)).trim().toLowerCase();
        if (input === 'true') {
          builderInstance.currentEmbed.fields[fieldNum - 1].inline = true;
        } else if (input === 'false') {
          builderInstance.currentEmbed.fields[fieldNum - 1].inline = false;
        } else {
          await displayMsg.edit('Invalid property.');
          return
        }
        await displayMsg.delete();
        await builderInstance.showEmbed(msgClient);
      } else {
        await displayMsg.edit('Invalid field property.');
        return
      }
    } catch (err) {
      await displayMsg.delete();
      await msgClient.channel.send(`Failed to edit field.`);
    }
  }
};
