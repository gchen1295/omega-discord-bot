import * as Discord from 'discord.js';
import { EmbedBuilder } from '../libs/embedBuilder';
import { getInput } from '../libs/helpers';

module.exports = {
  name: 'whedit',
  description: 'Edits saved webhook.',
  adminOnly: false,
  async execute(
    msgClient: Discord.Message,
    content: string,
    builderInstance: EmbedBuilder
  ) {
    let displayMsg: Discord.Message;
    try {
      const cleanContent = content.trim();
      displayMsg = await msgClient.channel.send(`Editing Webhook: \`${cleanContent}\``);
      const currentWebhooks = builderInstance.getWebhooks();
      const targetWebhook = currentWebhooks.find(webhook => webhook.label === cleanContent)
      if (targetWebhook) {
        await displayMsg.edit('`label` OR `url`?');
        let input = (await getInput(msgClient)).trim().toLowerCase();
        if (input === 'label') {
          await displayMsg.edit('Input new label:');
          input = (await getInput(msgClient)).trim();

          const existingLabel = currentWebhooks.find(webhook => webhook.label === input);
          if (existingLabel) {
            await displayMsg.edit('Label already exists.');
            return
          }
          targetWebhook.label = input;
          builderInstance.editWebhook(cleanContent, targetWebhook);
          await displayMsg.edit(`Edited webhook:\n\`\`\`Label: ${targetWebhook.label}\nURL: ${targetWebhook.webhook}`);
          return;
        } else if (input === 'url') {
          await displayMsg.edit('Input new url:');
          input = (await getInput(msgClient)).trim();

          const existingWebhook = currentWebhooks.find(webhook => webhook.webhook === input);
          if (existingWebhook) {
            await displayMsg.edit('URL already exists.');
            return
          }
          targetWebhook.webhook = input;
          builderInstance.editWebhook(cleanContent, targetWebhook);
          await displayMsg.edit(`Edited webhook:\n\`\`\`Label: ${targetWebhook.label}\nURL: ${targetWebhook.webhook}`);
          return;
        }
        await displayMsg.edit(`Invalid field: ${input}`);
        return;
      }

      displayMsg.edit(`Failed to find webhook with label \`${cleanContent}\``);
      return;
    } catch (err) {
      await msgClient.channel.send(`Failed to edit webhook.`);
    }
  }
};
