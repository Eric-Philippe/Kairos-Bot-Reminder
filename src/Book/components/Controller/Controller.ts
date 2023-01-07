import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  MessageActionRowComponentBuilder,
  ButtonInteraction,
  ChatInputCommandInteraction,
} from "discord.js";

import Page from "../Page/Page";

const NAVIGATION_BUTTONS = {
  NEXT: new ButtonBuilder()
    .setCustomId("next")
    .setLabel("Next")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("⏩"),
  PREVIOUS: new ButtonBuilder()
    .setCustomId("previous")
    .setLabel("Previous")
    .setStyle(ButtonStyle.Secondary)
    .setEmoji("⏪"),
  DOWNLOAD_XLSX: new ButtonBuilder()
    .setCustomId("download_xlsx")
    .setLabel("Download as xlsx")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("📄"),
  DOWNLOAD_PNG: new ButtonBuilder()
    .setCustomId("download_png")
    .setLabel("Download as png")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("🖼️"),
};

class Controller {
  public static buildController(page: Page): ActionRowBuilder<any>[] {
    const row =
      new ActionRowBuilder() as ActionRowBuilder<MessageActionRowComponentBuilder>;
    row.addComponents(NAVIGATION_BUTTONS.PREVIOUS);
    row.addComponents(NAVIGATION_BUTTONS.NEXT);

    const utilsRow =
      new ActionRowBuilder() as ActionRowBuilder<MessageActionRowComponentBuilder>;
    switch (true) {
      case page.type === "PAGE_TEXT":
        utilsRow.addComponents(NAVIGATION_BUTTONS.DOWNLOAD_XLSX);
        break;
      case page.type === "PAGE_GRAPH":
        utilsRow.addComponents(NAVIGATION_BUTTONS.DOWNLOAD_PNG);
    }
    if (page.type === "PAGE") return [row];
    return [row, utilsRow];
  }

  public static controllerListener(
    interaction: ChatInputCommandInteraction,
    userId: string,
    callBack: (i: ButtonInteraction) => void
  ): void {
    const collector = interaction.channel?.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 1000 * 60 * 5,
      filter: (i) =>
        ["next", "previous", "download_xlsx", "download_png"].includes(
          i.customId
        ),
    });

    collector?.on("collect", (i) => {
      if (i.user.id !== userId) {
        i.reply({ content: "None of your business.", ephemeral: true });
        return;
      }
      if (["next", "previous"].includes(i.customId)) i.deferUpdate();
      callBack(i);
    });
  }
}

export default Controller;
