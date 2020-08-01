import fs from 'fs';
import path from 'path';
import * as Discord from 'discord.js';
import { EmbedBuilder } from './libs/embedBuilder';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { dbSchema } from './db-schema';
import { getInput } from './libs/helpers';

const adapter = new FileSync('localDB.json')
const db = low(adapter);

interface Command {
  name: string;
  description: string;
  adminOnly: boolean;
  execute: (
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) => void;
}

const bot = new Discord.Client();
let ownerID: string;

const builderCommands: Discord.Collection<
  string,
  Command
> = new Discord.Collection();
let builder: EmbedBuilder;


const parseCommand = (
  message: string
): string | undefined => {
  const prefix = message.trim().substring(0, 2);
  if (prefix === '..') {
    return message.split(' ')[0].substring(2);
  }
  return undefined;
};

const embedHandler = async (
  command: string,
  messageContents: string,
  msgClient: Discord.Message,
  builderInstance: EmbedBuilder
) => {
  try {
    if (!builderCommands.has(command)) return;
    const currentCmd = builderCommands.get(command);
    if (currentCmd.adminOnly && !msgClient.member.roles.cache.has(db.get('adminRole').value())) {
      await msgClient.channel.send('There was an error trying to execute that command!');
      return
    }
    const contents = messageContents.split(' ').splice(1).join(' ');


    currentCmd.execute(msgClient, contents, builderInstance);
    msgClient.delete();
  } catch (err) {
    if (err.name === 'DiscordAPIError') {
      await msgClient.channel.send(`Discord API Error: ${err.message}`);
    } else {
      await msgClient.channel.send('There was an error trying to execute that command!');
    }
  }
};

const firstSetup = async (message: Discord.Message) => {
  try {
    const msgInput = await message.channel.send('Main Guild ID?');
    let input = (await getInput(message)).trim();
    const guildExists = bot.guilds.cache.get(input);
    if (guildExists) {
      db.set('mainGuild', input).write();
      builder.guildID = guildExists.id;
    } else {
      await msgInput.edit('Guild not found!')
      return
    }
    await msgInput.edit('Admin Role ID?');
    input = (await getInput(message)).trim();
    const roleExists = guildExists.roles.cache.get(input);
    if (roleExists) {
      db.set('adminRole', input).write();
      await msgInput.edit(`Finished first time setup.\nGuild: ${guildExists.name}\nAdmin Role: <@${roleExists.id}>`);
      builder.adminRoleID = roleExists.id;
      return
    }
    await msgInput.edit(`Cannot find role: ${roleExists.id} - <@${roleExists.id}>`);
    return;
  } catch {
    await message.channel.send('Failed to setup.');
  }
}

bot.on('ready', async () => {
  console.info('Bot connected. Loading modules and dependencies...');

  // Load commands
  const commandFiles = fs
    .readdirSync(path.join(__dirname, 'commands'))
    .filter(file => file.endsWith('.ts') || file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'commands', file));
    builderCommands.set(command.name, command);
  }
  console.info(`${builderCommands.size} commands loaded.`);
  db.defaults(dbSchema).write();
  console.info(`Loaded database`);
  builder = new EmbedBuilder(db.get('defaults.author').value(), db.get('defaults.footer').value(), db, db.get('mainGuild').value(), db.get('adminRole').value());
  builder.newEmbed();
  console.info(`Loaded embed builder module.`);
  ownerID = (await bot.fetchApplication()).owner.id;
});

bot.on('message', message => {
  if (message.author.bot) return;
  const cmd = parseCommand(message.content);
  if (cmd === void 0) return;

  if (cmd === 'first-setup' && message.author.id === ownerID) {
    if (db.get('adminRole').value() === '' || db.get('mainGuild').value() === '')
      firstSetup(message);
    return;
  }
  if (db.get('adminRole').value() === '' || db.get('mainGuild').value() === '') {
    message.channel.send('Bot needs setup. Contact ~Woof~ #6969 on Discord.')
    return;
  }

  embedHandler(cmd, message.content, message, builder);

});

bot.on('debug', msg => {
  console.log(msg);
})

bot.login(process.env.CLIENT_TOKEN).catch(console.error);
