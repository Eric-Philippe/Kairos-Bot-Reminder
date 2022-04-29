const Discord = require("discord.js");

const { client } = require("./utils/client"); // Discord Bot

const { IMG } = require("./ressources.json");

module.exports = class ReminderHelp {
  /** @param {Discord.Message} msg */
  constructor(msg) {
    this.msg = msg;
    /** @type {Discord.Message} */
    this.msgEmbed = null;
    /** @type {Discord.MessageEmbed} */
    this.secondEmbed = null;
    /** @type {Discord.Message} */
    this.msgSecondEmbed = null;
    /** @type {String | null} */
    this.currentSecondDisplay = null;
    this.sendMainEmbed();
  }

  async sendMainEmbed() {
    // Send the Embed
    this.msgEmbed = await this.msg.channel.send({
      embeds: [this.generateEmbed()],
      components: [this.generateRow()],
    });
    await this.buttonCollector();
  }

  async sendSecondEmbed() {
    this.msgSecondEmbed = await this.msg.channel.send({
      embeds: [this.secondEmbed],
    });
  }

  editSecondEmbed() {
    try {
      this.msgSecondEmbed.edit({
        embeds: [this.secondEmbed],
      });
    } catch (error) {
      throw error;
    }
  }

  generateEmbed() {
    let embed = new Discord.MessageEmbed()
      .setTitle("Reminder Help - Commands")
      .setColor("#03fcd3")
      .setFooter({
        text: "Provided by Kairos | Reminder Bot",
        iconURL: client.user.avatarURL(),
      })
      .setAuthor({
        name: this.msg.author.username,
        iconURL: this.msg.author.avatarURL(),
      })
      .setThumbnail(IMG.REMINDER_LOGO)
      .setDescription(
        "``💡`` **・ Remind Myself - RemindMe** \n" +
          "``✅`` ➸ ``remindMe`` - Reminds you of something in the future.\n" +
          "``🗑️`` ➸ ``delRemindMe`` - Delete the reminderMe of your choice.\n" +
          "``🗓️`` ➸ ``myRemindMe`` - Display all your reminderMe.\n" +
          "\n``☀️`` **・ Remind Ourselves - RemindUs** \n" +
          "``✅`` ➸ ``remindUs`` - Reminds the server of someting in the future.\n" +
          "``🗑️`` ➸ ``delRemindUs`` - Delete the RemindUs of your choice.\n" +
          "``🗓️`` ➸ ``myRemindUs`` - Display all the RemindUs from your server.\n" +
          "\n``📚`` **・ Category Manager - Group** \n" +
          "``✅`` ➸ ``createGroup`` - Create a group to categorize your RemindUs.\n" +
          "``🗑️`` ➸ ``delGroup`` - Delete one of the Category from your server.\n" +
          "``🗓️`` ➸ ``myGroups`` - Display all the Category from your server."
      )
      .setFooter({
        text: "All the commands can be entered regardless of the case !",
      });
    return embed;
  }

  generateRow() {
    // RemindMe
    const button_remindMe = new Discord.MessageButton()
      .setCustomId("me")
      .setEmoji("💡")
      .setStyle("PRIMARY");
    // RemindUs
    const button_remindUs = new Discord.MessageButton()
      .setCustomId("us")
      .setEmoji("☀️")
      .setStyle("PRIMARY");
    // Group
    const button_group = new Discord.MessageButton()
      .setCustomId("group")
      .setEmoji("📚")
      .setStyle("PRIMARY");
    const row = new Discord.MessageActionRow().addComponents([
      button_remindMe,
      button_remindUs,
      button_group,
    ]);
    return row;
  }

  buttonCollector() {
    console.log(this.msgEmbed);
    this.currentButtonsCollector =
      this.msgEmbed.createMessageComponentCollector({
        componentType: "BUTTON",
        time: 5 * 60 * 1000, // 5 minutes
      });
    // On Button Click
    this.currentButtonsCollector.on("collect", async (i) => {
      // Only if the user is the same as the author
      if (i.user.id === this.msg.author.id) {
        if (i.customId != this.currentSecondDisplay) {
          // Process of the Buttons
          switch (i.customId) {
            /**
             * case "customId":
             * Check if the interaction has already been processed
             * If not defer it
             * Do something
             */
            case "me":
              this.secondEmbed = this.generateMeEmbed();
              break;
            case "us":
              this.secondEmbed = this.generateUsEmbed();
              break;
            case "group":
              this.secondEmbed = this.generateGroupEmbed();
              break;
          }
          if (this.msgSecondEmbed) {
            this.editSecondEmbed();
          } else {
            this.sendSecondEmbed();
          }
          this.currentSecondDisplay = i.customId;
        } else {
          if (this.msgSecondEmbed) this.msgSecondEmbed.delete();
          this.msgSecondEmbed = null;
          this.currentSecondDisplay = null;
        }
        if (!i.deferred) i.deferUpdate();
      } else {
        i.reply({
          content: ```🙆‍♂️`` - These buttons aren't for you!`,
          ephemeral: true, // Only the user can see it
        });
      }
    });
    // At the end of the Collector
    this.currentButtonsCollector.on("end", (collected) => {});
  }

  generateMeEmbed() {
    const newLocal =
      "``💡`` **・ RemindMe Commands Format** \n\n" +
      "``✅`` ➸ ``remindMe`` \n" +
      " **#Format** : ``!remindMe <DD/MM/<YYYY>> [hh:mm] [Content of your reminder]`` | ``!remindme``\n" +
      " **@Example** : ``!remindme 13/05/2023 8:00 My Birthday``\n Will create a remind for the 13/05/2023 8:00 with the given content \n" +
      " **@Example** : ``!remindme 13/05 8:00 My Birthday`` \n Will create a reminder the 13/05 of the current year at 8:00 with the given content \n" +
      " **@Exemple** : ``!remindme 8:00 Sleep`` \n Will create a remind for the current day at 8:00 with the given content \n" +
      " **@Exemple** : ``!remindme`` \n Will open the full interface in order to fully personalize your remindme \n\n" +
      "``🗑️`` ➸ ``delRemindMe`` \n" +
      " **#Format** : ``!delRemindMe {Reminder Index}``\n" +
      " **@Example** : ``!delRemindMe`` \n Will display all your reminder and ask to enter the index corresponding to your reminder that you want to delete \n\n" +
      "``🗓️`` ➸ ``myRemindMe`` \n" +
      " **#Format** : ``!myRemindMe`` \n" +
      " **@Example** : ``!myRemindMe`` \n Will Display all your reminder \n\n\n" +
      "``⚙️`` ➸ ``Legend`` - <Optional> [Compulsory] {Futur Input}";
    let embed = new Discord.MessageEmbed()
      .setTitle("Remind Help - RemindMe")
      .setColor("#03fcd3")
      .setFooter({
        text: "Provided by Kairos | Reminder Bot",
        iconURL: client.user.avatarURL(),
      })
      .setAuthor({
        name: this.msg.author.username,
        iconURL: this.msg.author.avatarURL(),
      })
      .setThumbnail(IMG.REMINDER_LOGO)
      .setDescription(newLocal)
      .setFooter({
        text: "All the commands can be entered regardless of the case !",
      });
    return embed;
  }

  generateUsEmbed() {
    let embed = new Discord.MessageEmbed()
      .setTitle("Remind Help - RemindUs")
      .setColor("#03fcd3")
      .setFooter({
        text: "Provided by Kairos | Reminder Bot",
        iconURL: client.user.avatarURL(),
      })
      .setAuthor({
        name: this.msg.author.username,
        iconURL: this.msg.author.avatarURL(),
      })
      .setThumbnail(IMG.REMINDER_LOGO)
      .setDescription(
        "``☀️`` **・ RemindUs Commands Format** \n\n" +
          "``✅`` ➸ ``remindUs`` \n" +
          " **#Format** : ``!remindUs``\n" +
          " **&Permission** : @Admin \n" +
          " **@Exemple** : ``!remindUs`` \n Will open the full interface in order to fully personalize your remindus \n\n" +
          "``🗑️`` ➸ ``delRemindUs`` \n" +
          " **#Format** : ``!delRemindUs {Reminder Index}``\n" +
          " **&Permission** : @Admin \n" +
          " **@Example** : ``!delRemindUs`` \n Will Display all the reminder from your server and ask to enter the index corresponding to the reminder that you want to delete \n\n" +
          "``🗓️`` ➸ ``myRemindUs`` \n" +
          " **#Format** : ``!myRemindUs <Category Filter>`` \n" +
          " **&Permission** : @Admin \n" +
          " **@Example** : ``!myRemindUs`` \n Will display all your reminder \n" +
          " **@Example** : ``!myRemindUs Birthday`` \n Will display all the reminder with the category Birthday  \n" +
          " **@Example** : ``!myRemindUs None`` \n Will display all the reminder without category \n\n\n" +
          "``⚙️`` ➸ ``Legend`` - <Optional> [Compulsory] {Futur Input}"
      )
      .setFooter({
        text: "All the commands can be entered regardless of the case !",
      });
    return embed;
  }

  generateGroupEmbed() {
    let embed = new Discord.MessageEmbed()
      .setTitle("Remind Help - Group")
      .setColor("#03fcd3")
      .setFooter({
        text: "Provided by Kairos | Reminder Bot",
        iconURL: client.user.avatarURL(),
      })
      .setAuthor({
        name: this.msg.author.username,
        iconURL: this.msg.author.avatarURL(),
      })
      .setThumbnail(IMG.REMINDER_LOGO)
      .setDescription(
        "``📚`` **・ Category Manager Commands Format** \n\n" +
          "``✅`` ➸ ``createGroup`` \n" +
          " **#Format** : ``!createGroup [Label of the Group]``\n" +
          " **&Permission** : @Admin \n" +
          " **@Exemple** : ``!createGroup Todo`` \n Will create the category 'Todo' for your next RemindUs \n\n" +
          "``🗑️`` ➸ ``delGroup`` \n" +
          " **#Format** : ``!delgroup [Label of the group]``\n" +
          " **&Permission** : @Admin \n" +
          " **@Example** : ``!delgroup Todo`` \n Will delete the group with the name 'Todo' \n\n" +
          "``🗓️`` ➸ ``!myGroups`` \n" +
          " **#Format** : ``!myGroups`` \n" +
          " **&Permission** : @Admin \n" +
          " **@Example** : ``!myGroups`` \n Will Display all your categories \n\n\n" +
          "``⚙️`` ➸ ``Legend`` - <Optional> [Compulsory] {Futur Input}"
      )
      .setFooter({
        text: "All the commands can be entered regardless of the case !",
      });
    return embed;
  }
};
