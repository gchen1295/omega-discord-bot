import * as Discord from 'discord.js';

export const getImageInput = async (
  client: Discord.Message
): Promise<string> => {
  let lastMsg: Discord.Message;
  lastMsg = await client.channel.send('image OR url?');
  const basicFilter = (response: Discord.Message) =>
    response.author === client.author;
  let inputCollector: Discord.Collection<string, Discord.Message>;
  try {
    inputCollector = await client.channel.awaitMessages(basicFilter, {
      max: 1,
      time: 30000
    });
  } catch {
    await lastMsg.edit('Timed out.');
    return;
  }
  const input = inputCollector.first().content.toLowerCase();
  await inputCollector.first().delete();
  if (input === 'image') {
    await lastMsg.edit('Send image as attachment.');
    try {
      inputCollector = await client.channel.awaitMessages(basicFilter, {
        max: 1,
        time: 30000
      });
    } catch {
      await lastMsg.edit('Timed out.');
      return;
    }

    const attachment = inputCollector.first().attachments.first().url;

    if (/\.(jpe?g|png|gif)$/i.test(attachment)) {
      await lastMsg.delete();
      return attachment;
    } else {
      await lastMsg.edit('Not a supported image format');
      return;
    }
  } else if (input === 'url') {
    await lastMsg.edit('Input image url.');

    try {
      inputCollector = await client.channel.awaitMessages(basicFilter, {
        max: 1,
        time: 30000
      });
      const url = inputCollector.first().content;
      await inputCollector.first().delete();
      await lastMsg.delete();
      return url;
    } catch {
      await lastMsg.edit('Timed out.');
      return;
    }
  } else {
    await lastMsg.edit('Invalid input. Specify `image` or `url`.');
    return;
  }
};

export const getInput = async (message: Discord.Message) => {
  try {
    const input = await message.channel.awaitMessages(
      msg => msg.author === message.author,
      { time: 30000, max: 1 }
    );
    const inputValue = input.first().content;
    await input.first().delete();
    return inputValue;
  } catch {
    await message.channel.send('Failed to get input!');
    return;
  }
};
