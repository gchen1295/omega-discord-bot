import * as Discord from 'discord.js';
import { EmbedBuilder } from '../../libs/embedBuilder';

const getBuilderFieldHelp = (defaultIconURL: string): Discord.MessageEmbed => {
  const fieldHelpEmbed = new Discord.MessageEmbed();
  fieldHelpEmbed.setTitle('Title\t\t\tThumbnail 👉');
  fieldHelpEmbed.setDescription('Description Text\nDescription Text Continued');
  fieldHelpEmbed.setImage(defaultIconURL);
  fieldHelpEmbed.setThumbnail(defaultIconURL);
  fieldHelpEmbed.addField('Field 1', 'Field 1 Text - inline', true);
  fieldHelpEmbed.addField('Field 2', 'Field 2 Text - inline', true);
  fieldHelpEmbed.addField('Field 3', 'Field 3 Text', false);
  fieldHelpEmbed.addField('Field 4', 'Field 4 Text', false);
  fieldHelpEmbed.addField('Image', '👇', false);
  fieldHelpEmbed.setAuthor('Author Name', defaultIconURL);
  fieldHelpEmbed.setFooter('Footer Text', defaultIconURL);
  return fieldHelpEmbed;
};

module.exports = {
  name: 'preview',
  description: 'Previews current embed.',
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    await msgClient.channel.send(
      getBuilderFieldHelp(builderInstance.defaults.footer.iconURL)
    );
  }
};
