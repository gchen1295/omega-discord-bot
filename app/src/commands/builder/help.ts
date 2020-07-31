import * as Discord from 'discord.js';
import { EmbedBuilder } from '../../libs/embedBuilder';

const getBuilderHelp = (
  defaultFooter: Discord.MessageEmbedFooter,
  defaultAuthor: Discord.MessageEmbedAuthor
): Discord.MessageEmbed => {
  const builderHelpEmbed = new Discord.MessageEmbed();
  builderHelpEmbed.footer = defaultFooter;
  builderHelpEmbed.author = defaultAuthor;
  builderHelpEmbed.author.name += ` Embed Builder`;
  builderHelpEmbed.title = 'Embed Builder Help';
  builderHelpEmbed.addField(
    'General Commands',
    'new - creates new embed\nprev - cycles to previous embed. Use prev again to restore current embed.\npreview - view current embed.\nhelp - displays current menu.\nexample - displays an example embed with field labels.'
  );
  builderHelpEmbed.addField(
    'Embed Field Commands',
    'title\ndesc ( description )\nimg ( image - can be url or attachment )\nurl\nfooter-text\nfooter-img ( can be URL or attachment. )\nauthor-name\nauthor-img ( can be URL or attachment )\n`You can remove fields by using rm-{field}. Ex. rm-title removes the title`'
  );
  return builderHelpEmbed;
};

module.exports = {
  name: 'help',
  description: 'Displays help menu.',
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    await msgClient.channel.send(
      getBuilderHelp(
        builderInstance.defaults.footer,
        builderInstance.defaults.author
      )
    );
  }
};
