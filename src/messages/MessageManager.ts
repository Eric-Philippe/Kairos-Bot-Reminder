import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
/** Enum of the supported message type */
enum MessageType {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}
/**
 * Class that gather & manage the message sent by the bot
 */
export default class MessageManager {
  /**
   * Returns the success message type
   * @returns The success message type
   */
  public static getSuccessCnst(): string {
    return MessageType.SUCCESS;
  }
  /**
   * Returns the error message type
   * @returns The error message type
   */
  public static getErrorCnst(): string {
    return MessageType.ERROR;
  }
  /**
   * Send a message with a given type
   * @param type
   * @param msg
   * @param target
   */
  public static send(
    type: string,
    msg: string,
    target: ChatInputCommandInteraction | ButtonInteraction | TextChannel
  ) {
    switch (type) {
      case MessageType.SUCCESS:
        if (target instanceof ChatInputCommandInteraction)
          this.sendSuccessSlash(msg, target);
        else if (target instanceof ButtonInteraction)
          this.sendSuccessButton(msg, target);
        else if (target instanceof TextChannel)
          this.sendSuccessChannel(msg, target);
        break;
      case MessageType.ERROR:
        if (target instanceof ChatInputCommandInteraction)
          this.sendErrorSlash(msg, target);
        else if (target instanceof ButtonInteraction)
          this.sendErrorButton(msg, target);
        else if (target instanceof TextChannel)
          this.sendErrorChannel(msg, target);
        break;
    }
  }
  /**
   * Send a success message with a given message
   * @param msg
   * @param slashInteraction
   * @returns
   */
  public static sendSuccessSlash(
    msg: string,
    slashInteraction: ChatInputCommandInteraction
  ) {
    const embed = new EmbedBuilder()
      .setDescription("✅ | " + msg)
      .setColor("Green")
      .setFooter({ text: "⏳ Kairos | Bot Reminder" })
      .setTimestamp();

    try {
      if (slashInteraction.deferred)
        return slashInteraction.editReply({ embeds: [embed] });
      slashInteraction.reply({ embeds: [embed] });
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * Send a success message with a given message
   * @param msg
   * @param buttonInteraction
   * @returns
   */
  public static sendSuccessButton(
    msg: string,
    buttonInteraction: ButtonInteraction
  ) {
    const embed = new EmbedBuilder()
      .setDescription("✅ | " + msg)
      .setColor("Green")
      .setFooter({ text: "⏳ Kairos | Bot Reminder" })
      .setTimestamp();

    try {
      if (buttonInteraction.deferred)
        return buttonInteraction.editReply({ embeds: [embed] });
      buttonInteraction.reply({ embeds: [embed] });
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * Send a success message with a given message
   * @param msg
   * @param channel
   */
  public static sendSuccessChannel(msg: string, channel: TextChannel) {
    const embed = new EmbedBuilder()
      .setDescription("✅ | " + msg)
      .setColor("Green")
      .setFooter({ text: "⏳ Kairos | Bot Reminder" })
      .setTimestamp();

    try {
      channel.send({ embeds: [embed] });
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * Send an error message with a given message
   * @param msg
   * @param slashInteraction
   * @returns
   */
  public static sendErrorSlash(
    msg: string,
    slashInteraction: ChatInputCommandInteraction
  ) {
    const embed = new EmbedBuilder()
      .setDescription("❌ | " + msg)
      .setColor("Red")
      .setFooter({ text: "⏳ Kairos | Bot Reminder" })
      .setTimestamp();

    try {
      if (slashInteraction.deferred)
        return slashInteraction.editReply({ embeds: [embed] });
      slashInteraction.reply({ embeds: [embed] });
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * Send an error message with a given message
   * @param msg
   * @param slashInteraction
   * @returns
   */
  public static sendErrorButton(
    msg: string,
    buttonInteraction: ButtonInteraction
  ) {
    const embed = new EmbedBuilder()
      .setDescription("❌ | " + msg)
      .setColor("Red")
      .setFooter({ text: "⏳ Kairos | Bot Reminder" })
      .setTimestamp();

    try {
      if (buttonInteraction.deferred)
        return buttonInteraction.editReply({ embeds: [embed] });
      buttonInteraction.reply({ embeds: [embed] });
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * Send an error message with a given message
   * @param msg
   * @param slashInteraction
   * @returns
   */
  public static sendErrorChannel(msg: string, channel: TextChannel) {
    const embed = new EmbedBuilder()
      .setDescription("❌ | " + msg)
      .setColor("Red")
      .setFooter({ text: "⏳ Kairos | Bot Reminder" })
      .setTimestamp();

    try {
      channel.send({ embeds: [embed] });
    } catch (err) {
      console.log(err);
    }
  }
}
