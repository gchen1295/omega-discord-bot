import * as Discord from 'discord.js';

// Webhook sender and embed formatter
export class EmbedBuilder {
  currentEmbed: Discord.MessageEmbed;

  previousEmbed: Discord.MessageEmbed;

  defaults: {
    author: Discord.MessageEmbedAuthor;
    footer: Discord.MessageEmbedFooter;
  };

  displayedEmbed: Discord.Message;

  guildID: string;

  constructor(
    defaultAuthor: Discord.MessageEmbedAuthor,
    defaultFooter: Discord.MessageEmbedFooter,
    guildID: string
  ) {
    this.currentEmbed = new Discord.MessageEmbed();
    this.defaults = {
      author: defaultAuthor,
      footer: defaultFooter
    };
    this.guildID = guildID;
  }

  newEmbed(): Discord.MessageEmbed {
    this.previousEmbed = this.currentEmbed;
    this.currentEmbed = new Discord.MessageEmbed();
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
    inline?: boolean
  ): Discord.MessageEmbed {
    this.currentEmbed.addField(name, value, inline ? inline : true);
    return this.currentEmbed;
  }

  getWebhookFormatted() {
    return this.currentEmbed.toJSON();
  }
}
