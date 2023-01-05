import {
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} from "discord.js";

import Page from "../Page/Page";
import TextPage from "../Page/TextPage";

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
  DOWNLOAD_TXT: new ButtonBuilder()
    .setCustomId("download_txt")
    .setLabel("Download as txt")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("📄"),
  DOWNLOAD_PNG: new ButtonBuilder()
    .setCustomId("download_png")
    .setLabel("Download as png")
    .setStyle(ButtonStyle.Primary)
    .setEmoji("🖼️"),
};

class Controller {
  public static buildController(page: Page): ActionRowBuilder {
    const row = new ActionRowBuilder();
    row.addComponents(NAVIGATION_BUTTONS.PREVIOUS);
    switch (true) {
      case page instanceof TextPage:
        row.addComponents(NAVIGATION_BUTTONS.DOWNLOAD_TXT);
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
      filter: (i) => ["next", "previous", "download_txt"].includes(i.customId),
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
