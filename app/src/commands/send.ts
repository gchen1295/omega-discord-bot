import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';
import { getInput } from '../libs/helpers';

const getChannels = (msgClient: Discord.Message, builderInstance: EmbedBuilder): string[] => {
  const guild = msgClient.client.guilds.cache.get(builderInstance.guildID);
  if (guild) {
    const channels = guild.channels.cache
    const activeChannels = [];
    channels.forEach(channel => {
      if (channel.type === 'text') activeChannels.push(channel.id);
    });
    return activeChannels;
  }
  return [];
};

module.exports = {
  name: 'send',
  description: 'Sends current embed to available channels.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    try {
      if (msgClient.channel.type === 'dm') return;
      const channels = getChannels(msgClient, builderInstance);
      let msg = '';
      for (const channel of channels) {
        msg += `<#${channel}> - ${channel}\n`;
      }
      msg += `Input channel(s) as comma separated list:`;
      const lastMsg = await msgClient.channel.send(msg);

      const input = await getInput(msgClient);
      await lastMsg.edit(`Fetching channel(s)...`);
      const channelsInputted = input
        .trim()
        .split(',')
        .filter((value, index, self) => self.indexOf(value) === index);
      const foundChannels: Discord.TextChannel[] = [];
      const failedChannels: string[] = [];
      const succeededChannels: string[] = [];
      for (const channel of channelsInputted) {
        try {
          const targetChannel = msgClient.client.channels.cache.get(
            channel
          ) as Discord.TextChannel;
          if (targetChannel) {
            foundChannels.push(targetChannel);
          } else {
            failedChannels.push(channel);
          }
        } catch {
          failedChannels.push(channel);
        }
      }
      await lastMsg.edit(`Sending embed to channel(s)`);
      console.log(foundChannels);
      for (const channel of foundChannels) {
        let sentMsg: Discord.Message;
        try {
          sentMsg = await msgClient.channel.send(
            `Sending to <#${channel.id}>...`
          );
          await channel.send(builderInstance.currentEmbed);
          succeededChannels.push(channel.id);
          await sentMsg.edit(`Sent to <#${channel.id}>!`);
        } catch (err) {
          console.log(err);
          if (sentMsg) sentMsg.edit(`Failed to send to <#${channel.id}>!`);
          else msgClient.channel.send(`Failed to send to <#${channel.id}>!`);
          failedChannels.push(channel.id);
        }
      }
      await lastMsg.delete();

      let resultMessage = `Sent to ${succeededChannels.length} channels.`;
      if (failedChannels.length > 0) {
        let failedString = '';
        for (const failed of failedChannels)
          failedString += `<#${failed}> - ${failed}\n`;
        resultMessage += `\nFailed to send to:\n${failedString}`;
      }
      await msgClient.channel.send(resultMessage);
      return;
    } catch {
      await msgClient.channel.send(`Failed to send embed`);
      return;
    }
  }
};
