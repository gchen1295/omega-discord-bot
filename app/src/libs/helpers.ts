import * as Discord from 'discord.js';

export const getImageInput = async (
  client: Discord.Message
): Promise<string> => {
  await client.channel.send('image OR url?');
  const basicFilter = (response: Discord.Message) =>
    response.author === client.author;
  let inputCollector: Discord.Collection<string, Discord.Message>;
  try {
    inputCollector = await client.channel.awaitMessages(basicFilter, {
      max: 1,
      time: 30000
    });
  } catch {
    await client.channel.send('Timed out.');
    return;
  }
  const input = inputCollector.first().content;
  if (input === 'image') {
    await client.channel.send('Send image as attachment.');
    try {
      inputCollector = await client.channel.awaitMessages(basicFilter, {
        max: 1,
        time: 30000
      });
    } catch {
      await client.channel.send('Timed out.');
      return;
    }
    const attachment = inputCollector.first().attachments.first().url;
    if (/\.(jpe?g|png|gif)$/i.test(attachment)) {
      return attachment;
    } else {
      await client.channel.send('Not a supported image format');
    }
  } else if (input === 'url') {
    await client.channel.send('Input image url.');
    try {
      inputCollector = await client.channel.awaitMessages(basicFilter, {
        max: 1,
        time: 30000
      });
      const url = inputCollector.first().content;
      return url;
    } catch {
      await client.channel.send('Timed out.');
      return;
    }
  } else {
    await client.channel.send('Invalid input. Specify `image` or `url`.');
    return;
  }
};
