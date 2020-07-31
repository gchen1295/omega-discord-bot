import * as Discord from 'discord.js';
import { EmbedBuilder } from './libs/embedBuilder';

import fs from 'fs';
import path from 'path';

enum Task {
  Embed,
  WebHook
}

interface Command {
  name: string;
  description: string;
  execute: (
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) => void;
}

const defaultFooter: Discord.MessageEmbedFooter = {
  text: 'Omega Proxies',
  iconURL:
    'https://cdn.discordapp.com/icons/639144445001859144/21c011e22e792594530628e0d21ac01d.webp'
};

const defaultAuthor: Discord.MessageEmbedAuthor = {
  name: 'Omega Proxies',
  iconURL:
    'https://cdn.discordapp.com/icons/639144445001859144/21c011e22e792594530628e0d21ac01d.webp',
  url: 'https://omegaproxies.io/'
};

const bot = new Discord.Client();
const builderCommands: Discord.Collection<
  string,
  Command
> = new Discord.Collection();
const webhookCommands: Discord.Collection<
  string,
  Command
> = new Discord.Collection();
const builder = new EmbedBuilder(
  defaultAuthor,
  defaultFooter,
  '562032626450432002'
);

const embedPrefix = '..';
const webhookPrefix = '**';

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
    if (!builderCommands.has(command)) return;
    const contents = messageContents.split(' ').splice(1).join(' ');

    builderCommands.get(command).execute(msgClient, contents, builderInstance);
  } catch (err) {
    if (err.name === 'DiscordAPIError') {
      await msgClient.channel.send(`Discord API Error: ${err.message}`);
    } else {
      msgClient.reply('There was an error trying to execute that command!');
    }
  }
};

// Load up configs and modules here
bot.on('ready', () => {
  builder.newEmbed();
  let commandFiles = fs
    .readdirSync(path.join(__dirname, 'commands', 'builder'))
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', 'builder', file));
    builderCommands.set(command.name, command);
  }
  commandFiles = fs
    .readdirSync(path.join(__dirname, 'commands', 'webhook'))
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', 'webhook', file));
    webhookCommands.set(command.name, command);
  }
  console.log(builderCommands);
  console.log(webhookCommands);
});

bot.on('message', message => {
  if (message.author.bot) return;
  const task = parseCommand(message.content);
  if (task === void 0) return;
  if (task.type === Task.Embed) {
    embedHandler(task.command, message.content, message, builder);
    message.delete();
  }
});

bot.login(process.env.CLIENT_TOKEN);
