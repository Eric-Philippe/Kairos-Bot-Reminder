import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "src/CommandTemplate";

import { UsersServices } from "../tables/users/users.services";
import { TCategoryServices } from "../tables/tcategory/tcategory.services";

const Test: Command = {
  data: new SlashCommandBuilder()
    .setName("listcategory")
    .setDescription("Display all the categories of the user"),
  run: async (client, interaction) => {
    await UsersServices.isADBUser(interaction.user.id);
    let categories = await TCategoryServices.getTCategoriesByUserId(
      interaction.user.id
    );
    let txt = "";
    for (let i = 0; i < categories.length; i++) {
      txt += `🔶#${i + 1}. ${categories[i].title}\n`;
    }
    let embed = new EmbedBuilder()
      .setTitle(`List of ${interaction.user.username}'s categories`)
      .setColor("#5865F2")
      .setDescription(txt)
      .setFooter({ text: "⏳ | Provided by Kairos | Bot Reminder 1/1" })
      .setAuthor({
        name: `⚙️ | For ${interaction.user.username}`,
        iconURL: interaction.user.avatarURL() as string,
      });

    await interaction.reply({ embeds: [embed] });
  },
};

export default Test;
