import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';

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
    'new - Creates new embed.\nprev - Cycles to previous embed. Use prev again to restore current embed.\npreview - Generates new preview of current embed.\nsend - Displays channels and sends current embed to inputted channels.\nhelp - Displays current menu.\nexample - Displays an example embed with field labels.'
  );
  builderHelpEmbed.addField(
    'Embed Field Commands',
    'title `title` - Title\ndesc `description` - Description\nimg `url` OR `attachment` - Bottom image\nurl `url` - Title URL\nfooter-text `footer` - Footer text\nfooter-img `url` OR `attachment` - Footer image\nauthor-name `name` - Author name\nauthor-img `url` OR `attachment` - Author image\nthumbnail `url` OR `attachment` - Thumbnail image\nfield - Adds non-inline field.\nifield - Adds inline field\n`You can remove fields by using rm-{field}. Ex. rm-title removes the title`'
  );
  builderHelpEmbed.addField(
    'Template & Webhook Commands',
    'tsave `label` - Saves current embed as a template with the provided label as an identifier.\ntview - View saved templates.\ntdelete `label` - Delete template with given label.\ntload `label` - Load a saved template.\nwhadd - Adds webhook to stored list.\nwhdelete `label` - Delete webhook with given label.\nwhedit `label`- Edits webhook with given label.\nwhview - Shows stored webhooks.'
  );
  return builderHelpEmbed;
};

const getAdminHelp = (
  defaultFooter: Discord.MessageEmbedFooter,
  defaultAuthor: Discord.MessageEmbedAuthor
): Discord.MessageEmbed => {
  const builderHelpEmbed = new Discord.MessageEmbed();
  builderHelpEmbed.footer = defaultFooter;
  builderHelpEmbed.author = defaultAuthor;
  builderHelpEmbed.author.name += `Administrative`;
  builderHelpEmbed.title = 'Admin Commands Help';
  builderHelpEmbed.addField(
    'Commands',
    ''
  );
  return builderHelpEmbed;
};

module.exports = {
  name: 'help',
  description: 'Displays help menu.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    if (msgClient.channel.type !== 'dm')
      await msgClient.channel.send('DMing you help message.');
    await msgClient.author.send(
      getBuilderHelp(
        builderInstance.defaults.footer,
        builderInstance.defaults.author
      )
    );
  }
};
