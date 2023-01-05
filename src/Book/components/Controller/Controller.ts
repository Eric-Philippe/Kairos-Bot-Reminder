import {
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  MessageActionRowComponentBuilder,
} from "discord.js";

import Page from "../Page/Page";
import TextPage from "../Page/TextPage";
import GraphPage from "../Page/GraphPage";

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
  public static buildController(
    page: Page
  ): ActionRowBuilder<MessageActionRowComponentBuilder> {
    const row =
      new ActionRowBuilder() as ActionRowBuilder<MessageActionRowComponentBuilder>;
    row.addComponents(NAVIGATION_BUTTONS.PREVIOUS);
    switch (true) {
      case page instanceof TextPage:
        row.addComponents(NAVIGATION_BUTTONS.DOWNLOAD_XLSX);
        break;
      case page instanceof GraphPage:
        row.addComponents(NAVIGATION_BUTTONS.DOWNLOAD_PNG);
    }
    row.addComponents(NAVIGATION_BUTTONS.NEXT);
    return row;
  }

  public static controllerListener(
    msg: Message,
    userId: string,
    callBack: (s: string) => void
  ): void {
    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 1000 * 60 * 5,
      filter: (i) =>
        ["next", "previous", "download_xlsx", "download_png"].includes(
          i.customId
        ),
    });

    collector.on("collect", (i) => {
      if (i.user.id !== userId) {
        i.reply({ content: "None of your business.", ephemeral: true });
        return;
      }
      callBack(i.customId);
    });
  }
}

export default Controller;
