import * as Discord from 'discord.js';
import { EmbedBuilder } from '../../libs/embedBuilder';

const getChannels = (msgClient: Discord.Message): string[] => {
  const channels = msgClient.guild.channels.cache;
  const activeChannels = [];
  channels.forEach(channel => {
    if (channel.type === 'text') activeChannels.push(channel.id);
  });
  return activeChannels;
};

module.exports = {
  name: 'send',
  description: 'Sends current embed to available channels.',
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      if (msgClient.channel.type === 'dm') return;
      const channels = getChannels(msgClient);
      let msg = '**Select a channel by id:**\n';
      for (const channel of channels) {
        msg += `<#${channel}> - ${channel}\n`;
      }
      msgClient.channel.send(msg);

      const inputCollector = await msgClient.channel.awaitMessages(
        (inputMsg: Discord.Message) => inputMsg.author === msgClient.author,
        { max: 1, time: 30000 }
      );
      const input = inputCollector.first().content;
      msgClient.client.channels.fetch(input);

      // Find our channel and send.
      const targetChannel = msgClient.client.channels.cache.get(
        input
      ) as Discord.TextChannel;
      if (targetChannel) {
        await targetChannel.send(builderInstance.currentEmbed);
        await msgClient.channel.send('Embed sent!');
      }
    } catch (err) {
      console.log(err);
      if (err.name === 'DiscordAPIError') {
        await msgClient.channel.send(`Discord API Error: ${err.message}`);
      } else {
        await msgClient.channel.send(`Failed to send embed`);
      }
    }
  }
};
