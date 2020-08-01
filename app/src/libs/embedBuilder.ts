import * as Discord from 'discord.js';
import low from 'lowdb';
import { dbSchema } from '../db-schema'

// Webhook sender and embed formatter
export class EmbedBuilder {
  currentEmbed: Discord.MessageEmbed;

  previousEmbed: Discord.MessageEmbed;

  defaults: {
    author: Discord.MessageEmbedAuthor;
    footer: Discord.MessageEmbedFooter;
  };

  guildID: string;

  adminRoleID: string;

  displayedEmbed: Discord.Message | undefined;

  db: low.LowdbSync<typeof dbSchema>;

  constructor(
    defaultAuthor: Discord.MessageEmbedAuthor,
    defaultFooter: Discord.MessageEmbedFooter,
    dbInstance: low.LowdbSync<typeof dbSchema>,
    guild: string,
    adminRole: string
  ) {
    this.currentEmbed = new Discord.MessageEmbed();
    this.defaults = {
      author: defaultAuthor,
      footer: defaultFooter
    };
    this.db = dbInstance;
    this.guildID = guild;
    this.adminRoleID = adminRole;
  }

  async showEmbed(message: Discord.Message): Promise<Discord.Message> {

    if (this.displayedEmbed !== void 0) {
      try {
        await this.displayedEmbed.edit(this.currentEmbed);
      } catch{
        try {
          this.displayedEmbed = await message.channel.send(this.currentEmbed);
        } catch (err) {
          if (err.name === 'DiscordAPIError') {
            await message.channel.send(`Discord API Error: ${err.message}`);
            return;
          } else {
            await message.channel.send(`Failed to preview embed`);
            return;
          }
        }
      }
    } else {
      try {
        this.displayedEmbed = await message.channel.send(this.currentEmbed);
      } catch (err) {
        if (err.name === 'DiscordAPIError') {
          await message.channel.send(`Discord API Error: ${err.message}`);
          return;
        } else {
          await message.channel.send(`Failed to preview embed`);
          return;
        }
      }
    }

    return this.displayedEmbed;
  }

  addWebhook(label: string, link: string): { label: string, webhook: string }[] {
    const currentWebhooks = this.db.get('webhooks').value();
    const existingWebhook = currentWebhooks.find(template => template.label === label || template.webhook === link);
    if (existingWebhook) return
    const newSave = {
      webhook: link,
      label
    };
    currentWebhooks.push(newSave);
    this.db.set('webhooks', currentWebhooks).write();
    return currentWebhooks;
  }

  deleteWebhook(label: string): { label: string, webhook: string }[] {
    const currentWebhooks = this.db.get('webhooks').value();
    const foundIndex = currentWebhooks.findIndex(webhook => webhook.label === label);
    if (foundIndex === -1) return
    currentWebhooks.splice(foundIndex, 1);
    this.db.set('webhooks', currentWebhooks);
    return currentWebhooks;
  }

  getWebhooks(): { label: string, webhook: string }[] {
    const currentWebhooks = this.db.get('webhooks').value();
    if (currentWebhooks) return currentWebhooks;
    return;
  }

  saveTemplate(label: string): { label: string, template: Discord.MessageEmbed } {
    const currentTemplates = this.db.get('templates').value();
    const existingTemplate = currentTemplates.find(template => template.label === label);
    if (existingTemplate) return
    const newSave = {
      label,
      template: Object.assign({}, this.currentEmbed)
    };
    currentTemplates.push(newSave);
    this.db.set('templates', currentTemplates).write();
    return newSave;
  }

  loadTemplate(label: string): Discord.MessageEmbed {
    const currentTemplates = this.db.get('templates').value();
    const foundIndex = currentTemplates.findIndex(template => template.label === label);
    if (foundIndex === -1) return
    this.previousEmbed = this.currentEmbed;
    this.currentEmbed = new Discord.MessageEmbed(currentTemplates[foundIndex].template);
    return this.currentEmbed;
  }

  deleteTemplate(label: string): Discord.MessageEmbed[] {
    const currentTemplates = this.db.get('templates').value();
    const foundIndex = currentTemplates.findIndex(template => template.label === label);
    if (foundIndex === -1) return
    currentTemplates.splice(foundIndex, 1);
    this.db.set('templates', currentTemplates);
    return currentTemplates;
  }

  getTemplates(): { label: string, template: Discord.MessageEmbed }[] {
    return this.db.get('templates').value();
  }

  swapPrevious(): Discord.MessageEmbed {
    if (this.previousEmbed) {
      const tmp = this.currentEmbed;
      this.currentEmbed = this.previousEmbed;
      this.previousEmbed = tmp;
      return this.currentEmbed;
    }
    return;
  }

  newEmbed(): Discord.MessageEmbed {
    this.previousEmbed = this.currentEmbed;
    this.currentEmbed = new Discord.MessageEmbed();
    this.displayedEmbed = void 0;
    if (this.previousEmbed.footer) {
      this.currentEmbed.footer = this.previousEmbed.footer;
    } else {
      this.currentEmbed.setFooter(
        this.defaults.footer.text,
        this.defaults.footer.iconURL
      );
    }

    if (this.previousEmbed.author) {
      this.currentEmbed.author = this.previousEmbed.author;
    } else {
      this.currentEmbed.setAuthor(
        this.defaults.author.name,
        this.defaults.author.iconURL,
        this.defaults.author.url
      );
    }

    return this.currentEmbed;
  }

  addTitle(title: string): Discord.MessageEmbed {
    if (title.length >= 256)
      throw new RangeError('Title must be less than 256 characters');
    this.currentEmbed.setTitle(title);
    return this.currentEmbed;
  }

  removeTitle(): Discord.MessageEmbed {
    delete this.currentEmbed.title;
    return this.currentEmbed;
  }

  addDescription(description: string): Discord.MessageEmbed {
    if (description.length >= 2048)
      throw new RangeError('Description must be less than 2048 characters');
    this.currentEmbed.setDescription(description);
    return this.currentEmbed;
  }

  removeDescription(): Discord.MessageEmbed {
    delete this.currentEmbed.description;
    return this.currentEmbed;
  }

  addUrl(url: string): Discord.MessageEmbed {
    this.currentEmbed.setURL(url);
    return this.currentEmbed;
  }

  removeUrl(): Discord.MessageEmbed {
    delete this.currentEmbed.url;
    return this.currentEmbed;
  }

  addImage(url: string): Discord.MessageEmbed {
    this.currentEmbed.setImage(url);
    return this.currentEmbed;
  }

  removeImage(): Discord.MessageEmbed {
    delete this.currentEmbed.image;
    return this.currentEmbed;
  }

  addThumbnail(url: string): Discord.MessageEmbed {
    this.currentEmbed.setThumbnail(url);
    return this.currentEmbed;
  }

  removeThumbnail(): Discord.MessageEmbed {
    delete this.currentEmbed.thumbnail;
    return this.currentEmbed;
  }

  addColor(color: number): Discord.MessageEmbed {
    this.currentEmbed.setColor(color);
    return this.currentEmbed;
  }

  deleteColor(): Discord.MessageEmbed {
    delete this.currentEmbed.color;
    return this.currentEmbed;
  }

  setFooterImage(url: string): Discord.MessageEmbed {
    this.currentEmbed.footer.iconURL = url;
    return this.currentEmbed;
  }

  setFooterText(text: string): Discord.MessageEmbed {
    this.currentEmbed.footer.text = text;
    return this.currentEmbed;
  }

  resetFooter(): Discord.MessageEmbed {
    this.currentEmbed.setFooter(
      'Omega Proxies',
      'https://cdn.discordapp.com/icons/639144445001859144/21c011e22e792594530628e0d21ac01d.webp'
    );
    return this.currentEmbed;
  }

  setAuthorImage(url: string): Discord.MessageEmbed {
    this.currentEmbed.author.iconURL = url;
    return this.currentEmbed;
  }

  setAuthorName(text: string): Discord.MessageEmbed {
    this.currentEmbed.author.name = text;
    return this.currentEmbed;
  }

  setAuthorUrl(url: string): Discord.MessageEmbed {
    this.currentEmbed.author.url = url;
    return this.currentEmbed;
  }

  resetAuthor(): Discord.MessageEmbed {
    this.currentEmbed.setAuthor(
      'Omega Proxies',
      'https://cdn.discordapp.com/icons/639144445001859144/21c011e22e792594530628e0d21ac01d.webp',
      'https://omegaproxies.io/'
    );
    return this.currentEmbed;
  }

  addField(
    name: string,
    value: string,
    inline: boolean
  ): Discord.MessageEmbed {
    if (this.currentEmbed.fields.length >= 25) return

    this.currentEmbed.addField(name, value, inline);
    return this.currentEmbed;
  }

  getWebhookFormatted() {
    return this.currentEmbed.toJSON();
  }

  editWebhook(label: string, webhook: { label: string, webhook: string }): { label: string, webhook: string }[] {
    const currentWebhooks = this.db.get('webhooks').value();
    const existingWebhook = currentWebhooks.findIndex(template => template.label === label);
    if (existingWebhook > -1) {
      currentWebhooks[existingWebhook] = webhook;
      this.db.set('webhooks', currentWebhooks).write();
      return currentWebhooks;
    }
    return
  }
}
