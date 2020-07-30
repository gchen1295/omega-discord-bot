import * as Discord from 'discord.js';
import { EmbedBuilder, Footer, Author } from './libs/embedBuilder';
import { assert } from 'console';

const defaultFooter: Footer = {
  text: 'Omega Proxies',
  iconUrl:
    'https://cdn.discordapp.com/icons/639144445001859144/21c011e22e792594530628e0d21ac01d.webp'
};

const defaultAuthor: Author = {
  name: 'Omega Proxies',
  iconUrl:
    'https://cdn.discordapp.com/icons/639144445001859144/21c011e22e792594530628e0d21ac01d.webp',
  url: 'https://omegaproxies.io/'
};

const bot = new Discord.Client();
const builder = new EmbedBuilder(defaultAuthor, defaultFooter);

const embedPrefix = '..';
const webhookPrefix = '**';

enum Task {
  Embed,
  WebHook
}

const parseCommand = (
  message: string
): { type: Task; command: string } | undefined => {
  const prefix = message.trim().substring(0, 2);
  if (prefix === embedPrefix) {
    return { type: Task.Embed, command: message.split(' ')[0].substring(2) };
  } else if (prefix === webhookPrefix) {
    return { type: Task.WebHook, command: message.split(' ')[0].substring(2) };
  }
  return undefined;
};

// Add a way to remove fields
const embedHandler = async (
  command: string,
  messageContents: string,
  msgClient: Discord.Message,
  builderInstance: EmbedBuilder
) => {
  try {
    // Strip command from message
    const contents = messageContents.split(' ').splice(1).join(' ');
    switch (command) {
      case 'new':
        builderInstance.newEmbed();
        await msgClient.channel.send(
          builderInstance.addDescription('New Embed')
        );
        builderInstance.currentEmbed.description = '';
        break;

      case 'prev':
        if (builderInstance.previousEmbed === undefined) {
          await msgClient.channel.send('No previous embed to preview.');
          break;
        }
        await msgClient.channel.send(builderInstance.previousEmbed);
        break;

      case 'title':
        const prevTitle = builderInstance.currentEmbed.title;
        try {
          await msgClient.channel.send(builderInstance.addTitle(contents));
        } catch (err) {
          prevTitle
            ? builderInstance.addTitle(prevTitle)
            : builderInstance.removeTitle();
          if (err.name === 'DiscordAPIError') {
            await msgClient.channel.send(`Discord API Error: ${err.message}`);
          } else {
            await msgClient.channel.send(`Failed to add title!`);
          }
        }
        break;

      case 'rm-title':
        try {
          await msgClient.channel.send(builderInstance.removeTitle());
        } catch (err) {
          if (err.name === 'DiscordAPIError') {
            await msgClient.channel.send(`Discord API Error: ${err.message}`);
          } else {
            await msgClient.channel.send(`Failed to preview new embed`);
          }
        }
        break;

      case 'desc':
        const prevDescription = builderInstance.currentEmbed.description;
        try {
          await msgClient.channel.send(
            builderInstance.addDescription(contents)
          );
        } catch (err) {
          prevDescription
            ? builderInstance.addDescription(prevDescription)
            : builderInstance.removeDescription();
          if (err.name === 'DiscordAPIError') {
            await msgClient.channel.send(`Discord API Error: ${err.message}`);
          } else {
            await msgClient.channel.send(`Failed to add description!`);
          }
        }
        break;

      case 'rm-desc':
        try {
          await msgClient.channel.send(builderInstance.removeDescription());
        } catch (err) {
          if (err.name === 'DiscordAPIError') {
            await msgClient.channel.send(`Discord API Error: ${err.message}`);
          } else {
            await msgClient.channel.send(`Failed to preview new embed`);
          }
        }
        break;

      case 'img':
        const prevImage = builderInstance.currentEmbed.image?.url;
        console.log('Images');
        try {
          await msgClient.channel.send('image OR url?');
          const basicFilter = (response: Discord.Message) =>
            response.author === msgClient.author;
          let inputCollector: Discord.Collection<string, Discord.Message>;
          try {
            inputCollector = await msgClient.channel.awaitMessages(
              basicFilter,
              {
                max: 1,
                time: 30000
              }
            );
          } catch {
            prevImage
              ? builderInstance.addImage(prevImage)
              : builderInstance.removeImage();
            await msgClient.channel.send('Timed out.');
            return;
          }
          const input = inputCollector.first().content;
          if (input === 'image') {
            await msgClient.channel.send('Send image as attachment.');
            try {
              inputCollector = await msgClient.channel.awaitMessages(
                basicFilter,
                {
                  max: 1,
                  time: 30000
                }
              );
            } catch {
              prevImage
                ? builderInstance.addImage(prevImage)
                : builderInstance.removeImage();
              await msgClient.channel.send('Timed out.');
              return;
            }
            const attachment = inputCollector.first().attachments.first().url;
            if (/\.(jpe?g|png|gif)$/i.test(attachment)) {
              await msgClient.channel.send(
                builderInstance.addImage(attachment)
              );
            } else {
              await msgClient.channel.send('Not a support image format');
            }
          } else if (input === 'url') {
            await msgClient.channel.send('Input image url.');
            try {
              inputCollector = await msgClient.channel.awaitMessages(
                basicFilter,
                {
                  max: 1,
                  time: 30000
                }
              );
              const url = inputCollector.first().content;
              await msgClient.channel.send(builderInstance.addImage(url));
            } catch {
              prevImage
                ? builderInstance.addImage(prevImage)
                : builderInstance.removeImage();
              await msgClient.channel.send('Timed out.');
              return;
            }
          } else {
            prevImage
              ? builderInstance.addImage(prevImage)
              : builderInstance.removeImage();
            await msgClient.channel.send(
              'Invalid input. Specify `image` or `url`.'
            );
          }
        } catch (err) {
          prevImage
            ? builderInstance.addImage(prevImage)
            : builderInstance.removeImage();
          if (err.name === 'DiscordAPIError') {
            await msgClient.channel.send(`Discord API Error: ${err.message}`);
          } else {
            await msgClient.channel.send(`Failed to add image!`);
          }
        }
        break;

      case 'rm-img':
        try {
          await msgClient.channel.send(builderInstance.removeImage());
        } catch (err) {
          if (err.name === 'DiscordAPIError') {
            await msgClient.channel.send(`Discord API Error: ${err.message}`);
          } else {
            await msgClient.channel.send(`Failed to preview new embed`);
          }
        }
        break;

      case 'url':
        const prevURL = builderInstance.currentEmbed.url;
        try {
          await msgClient.channel.send(builderInstance.addUrl(contents));
        } catch (err) {
          prevURL
            ? builderInstance.addUrl(prevURL)
            : builderInstance.removeUrl();
          if (err.name === 'DiscordAPIError') {
            await msgClient.channel.send(`Discord API Error: ${err.message}`);
          } else {
            await msgClient.channel.send(`Failed to add URL!`);
          }
        }
        break;

      case 'rm-url':
        try {
          await msgClient.channel.send(builderInstance.removeUrl());
        } catch (err) {
          if (err.name === 'DiscordAPIError') {
            await msgClient.channel.send(`Discord API Error: ${err.message}`);
          } else {
            await msgClient.channel.send(`Failed to preview new embed`);
          }
        }
        break;

      case 'footer':
        await msgClient.channel.send('Use ..footer-text OR ..footer-image');
        break;

      case 'footer-image':
        try {
          await msgClient.channel.send(
            builderInstance.setFooterImage(contents)
          );
        } catch (err) {
          builderInstance.currentEmbed.footer.iconURL =
            builderInstance.defaults.footer.iconUrl;
          if (err.name === 'DiscordAPIError') {
            await msgClient.channel.send(`Discord API Error: ${err.message}`);
          } else {
            await msgClient.channel.send(`Failed to add footer image!`);
          }
        }
        break;

      case 'footer-text':
        try {
          await msgClient.channel.send(builderInstance.setFooterText(contents));
        } catch (err) {
          builderInstance.currentEmbed.footer.text =
            builderInstance.defaults.footer.text;
          if (err.name === 'DiscordAPIError') {
            await msgClient.channel.send(`Discord API Error: ${err.message}`);
          } else {
            await msgClient.channel.send(`Failed to add footer text!`);
          }
        }
        break;

      case 'author':
        await msgClient.channel.send('Use ..author-name OR ..author-image');
        break;

      case 'author-image':
        try {
          await msgClient.channel.send(
            builderInstance.setAuthorImage(contents)
          );
        } catch (err) {
          builderInstance.currentEmbed.author.iconURL =
            builderInstance.defaults.author.iconUrl;
          if (err.name === 'DiscordAPIError') {
            await msgClient.channel.send(`Discord API Error: ${err.message}`);
          } else {
            await msgClient.channel.send(`Failed to add author image!`);
          }
        }
        break;

      case 'author-name':
        try {
          await msgClient.channel.send(builderInstance.setAuthorName(contents));
        } catch (err) {
          builderInstance.currentEmbed.author.name =
            builderInstance.defaults.author.name;
          if (err.name === 'DiscordAPIError') {
            await msgClient.channel.send(`Discord API Error: ${err.message}`);
          } else {
            await msgClient.channel.send(`Failed to add author name!`);
          }
        }
        break;

      case 'preview':
        await msgClient.channel.send(builderInstance.currentEmbed);
        break;

      default:
        break;
    }
  } catch (err) {
    if (err.name === 'DiscordAPIError') {
      await msgClient.channel.send(`Discord API Error: ${err.message}`);
    }
  }
};

// Load up configs and modules here
bot.on('ready', () => {
  builder.newEmbed();
});

bot.on('message', message => {
  if (message.author.bot) return;
  const task = parseCommand(message.content);
  if (task === void 0) return;
  if (task.type === Task.Embed) {
    embedHandler(task.command, message.content, message, builder);
  }
});

bot.login(process.env.CLIENT_TOKEN);
