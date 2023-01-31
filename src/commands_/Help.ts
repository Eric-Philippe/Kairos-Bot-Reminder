import {
  ActionRowBuilder,
  AnyComponentBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  InteractionResponse,
  Message,
  MessageActionRowComponentBuilder,
} from "discord.js";
import { CommandCategories } from "./categories";
import Commands from "../Commands";
import { Command } from "src/CommandTemplate";
import { IMG } from "../assets/LOGOS.json";

const mapSubCommandEmoji = new Map<string, string>([
  ["set", "📥"],
  ["delete", "🗑️"],
  ["list", "📜"],
  ["break", "🔨"],
  ["restart", "🔄"],
  ["show", "📟"],
  ["category", "📁"],
  ["activity", "📋"],
  ["task", "📝"],
  ["bydate", "📅"],
]);

const Separator = (length: number) => {
  let separator = "";
  for (let i = 0; i < length; i++) {
    separator += "<:emdash:1064321796976947314>";
  }
  return separator;
};

const Connector = () => {
  return "<:baton:1064321778530402398>";
};

export class Help {
  _interaction: ChatInputCommandInteraction;
  _commands: typeof Commands | undefined;
  _commandsTree: Map<string, Category>;
  _response: InteractionResponse | null = null;
  _secondLevelResponse: Message<boolean> | null = null;
  _currentSubCategory: string | null = null;
  _thirdLevelResponse: Message<boolean> | null = null;
  _currentCommand: string | null = null;

  constructor(interaction: ChatInputCommandInteraction, client: Client) {
    this._interaction = interaction;
    this._commands = Commands;
    this._commandsTree = this.buildCommandsTree();
    this.sendMenu();
  }

  private buildCommandsTree(): Map<string, Category> {
    let categories: Map<string, Category> = new Map<string, Category>();
    this._commands?.forEach((command) => {
      let category = command.description.categoryName;
      if (!categories.has(category)) {
        categories.set(
          category,
          new Category(
            category,
            CommandCategories.getCATEGORY(category)?.emoji ?? "❓",
            command
          )
        );
      } else {
        categories.get(category)?.addCommand(command);
      }
    });
    return categories;
  }

  public buildController(): ActionRowBuilder<MessageActionRowComponentBuilder> {
    if (this._commandsTree.size == 0) return new ActionRowBuilder();
    let row =
      new ActionRowBuilder() as ActionRowBuilder<MessageActionRowComponentBuilder>;
    let i = 0;
    this._commandsTree.forEach((category) => {
      row.addComponents(
        new ButtonBuilder()
          .setCustomId(category._name)
          .setLabel(category._name)
          .setStyle(ButtonStyle.Primary)
          .setEmoji(category._emoji)
      );
    });
    return row;
  }

  private async launchController(): Promise<void> {
    if (!this._response) throw new Error("No response to listen to");
    const collector = this._response.createMessageComponentCollector({
      time: 60000,
    });
    collector?.on("collect", async (interaction: ButtonInteraction) => {
      if (interaction.user.id != this._interaction.user.id) {
        await interaction.reply({
          content: "You are not the one who asked for help!",
          ephemeral: true,
        });
        return;
      }
      await interaction.deferUpdate();
      let category = this._commandsTree.get(interaction.customId);
      if (category) {
        await this.sendCategory(category);
      } else {
        await interaction.followUp({
          content: "This category doesn't exist!",
          ephemeral: true,
        });
      }
    });
  }

  private async sendCategory(category: Category): Promise<void> {
    if (!this._response) throw new Error("No response to listen to");
    if (this._thirdLevelResponse) {
      this._thirdLevelResponse.delete();
      this._thirdLevelResponse = null;
      this._currentCommand = null;
    }
    if (category._name === this._currentSubCategory) {
      this._secondLevelResponse?.delete();
      this._secondLevelResponse = null;
      this._currentSubCategory = null;
    } else {
      let embed = new EmbedBuilder()
        .setTitle(`📚 Help for the category ${category._name} ⏳`)
        .setAuthor({ name: category.Description })
        .setThumbnail(IMG.CLOCK_LOGO)
        .setColor("#5865A0")
        .setFooter({
          text:
            `Asked by ${this._interaction.user.username} - ` +
            `Page ${this._commandsTree.size - 1}/${this._commandsTree.size}`,
        });
      let commands = category._commands;
      let description =
        "**Click on the grey buttons to see more information about the command!**\n\n";
      description += this.buildDescriptionSecondLevel(commands);
      embed.setDescription(description);

      if (this._secondLevelResponse) {
        await this._secondLevelResponse.edit({
          embeds: [embed],
          components: this.buildControllerCommands(commands) as any,
        });
      } else {
        this._secondLevelResponse = await this._interaction.followUp({
          embeds: [embed],
          components: this.buildControllerCommands(commands) as any,
        });
      }
      this._currentSubCategory = category._name;
      this.launchControllerThirdLevel();
    }
  }

  buildDescriptionSecondLevel(commands: Map<String, Command>): string {
    let description = "";
    commands.forEach((command) => {
      description +=
        "``" +
        command.description.emoji +
        "``" +
        `・ ${command.description.name}\n`;
    });
    return description;
  }

  buildControllerCommands(
    commands: Map<String, Command>
  ): ActionRowBuilder<AnyComponentBuilder>[] {
    let totalCommands = commands.size;
    let currentRow = new ActionRowBuilder();
    let rows = new Array<ActionRowBuilder<AnyComponentBuilder>>();
    let i = 0;
    let j = 0;
    commands.forEach((command) => {
      if (i == 5) {
        rows.push(currentRow);
        currentRow = new ActionRowBuilder();
        i = 0;
      }
      currentRow.addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setCustomId(command.description.name)
          .setEmoji(command.description.emoji)
      );
      i++;
      j++;
      if (j == totalCommands) {
        rows.push(currentRow);
      }
    });
    return rows;
  }

  launchControllerThirdLevel(): void {
    const collector =
      this._secondLevelResponse?.createMessageComponentCollector({
        time: 60000,
      });

    collector?.on("collect", async (interaction: ButtonInteraction) => {
      console.log("LOAN");

      if (interaction.user.id !== this._interaction.user.id) {
        await interaction.reply({
          content: "You can't use this button!",
          ephemeral: true,
        });
        return;
      }
      await interaction.deferUpdate();
      if (!this._currentSubCategory) this._currentSubCategory = "General";
      if (!this._commandsTree) return;
      let command = this._commandsTree
        ?.get(this._currentSubCategory)
        ?._commands.get(interaction.customId);
      if (command) {
        await this.sendCommand(command);
      } else {
        try {
          await interaction.followUp({
            content: "This command doesn't exist!",
            ephemeral: true,
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
  }

  async sendCommand(command: Command): Promise<void> {
    if (this._currentCommand == command.description.name) {
      if (this._thirdLevelResponse) this._thirdLevelResponse.delete();
      this._currentCommand = null;
      this._thirdLevelResponse = null;
      return;
    }
    let embed = new EmbedBuilder()
      .setTitle(`📚 Help for the command ${command.description.name} ⏳`)
      .setThumbnail(IMG.CLOCK_LOGO)
      .setColor("#5869A0")
      .setFooter({
        text:
          `Asked by ${this._interaction.user.username} - ` +
          `Page ${this._commandsTree.size - 1}/${this._commandsTree.size}`,
      });
    let description = "";
    description += `**${command.description.emoji} ・ ${command.description.name}**\n`;
    description += `**Description:** ${command.description.fullDescription}\n`;
    // description += `**Usage:** ${command.description.usage}\n`;
    if (command.data.options) {
      command.data.options.forEach(
        (option: { name: string; description: string; type: number }) => {
          if (!option.type) {
            let emote = mapSubCommandEmoji.get(option.name) ?? "❓";
            description += `**${emote} ・ ${option.name}**\n`;
            description += `**Description:** ${option.description}\n`;
          }
        }
      );
    }
    embed.setDescription(description);
    try {
      if (this._thirdLevelResponse) {
        await this._thirdLevelResponse.edit({ embeds: [embed] });
      } else {
        this._thirdLevelResponse = await this._interaction.followUp({
          embeds: [embed],
        });
      }
    } catch (err) {
      console.log(err);
    }
    this._currentCommand = command.description.name;
  }

  public async sendMenu() {
    let embeds = new Array<EmbedBuilder>();
    let descriptions = new Array<string>();
    let description = "";
    this._commandsTree.forEach((category) => {
      description += "```" + `${category._emoji} ・ ${category._name}` + "```";
      category._commands.forEach((command) => {
        description += `${Connector()}${Separator(1)} ${
          "``" + command.description.emoji + "``"
        } → [${command.description.name}](${
          "https://github.com/Eric-Philippe/Kairos-Bot-Reminder" +
          " " +
          '"' +
          command.description.fullDescription +
          '"'
        })\n`;
        if (command.data.options) {
          command.data.options.forEach(
            (option: { name: string; description: string; type: number }) => {
              if (!option.type) {
                let emote = mapSubCommandEmoji.get(option.name) ?? "❓";
                description += `${Connector()}${Separator(2)} ${
                  "``" + emote + "``"
                }・ [${option.name}](${
                  "https://github.com/Eric-Philippe/Kairos-Bot-Reminder" +
                  " " +
                  '"' +
                  option.description +
                  '"'
                })\n`;
              }
            }
          );
        }
      });
      description += "\n";
      descriptions.push(description);
      description = "";
    });
    let currentDescription = "";
    let i = 1;
    descriptions.forEach((description) => {
      if (currentDescription.length + description.length > 4096) {
        embeds.push(
          new EmbedBuilder()
            .setTitle("📚 Help ⏳")
            .setDescription(currentDescription)
            .setThumbnail(IMG.CHAT_LOGO)
            .setAuthor({
              name: "Hover the commands to see the detailled descriptions -",
              iconURL: IMG.BELL_LOGO,
            })
            .setFooter({
              text:
                `Asked by ${this._interaction.user.username} | ` +
                i++ +
                "/" +
                this._commandsTree.size,
              iconURL: this._interaction.user.avatarURL() || undefined,
            })
            .setColor("#5865F2")
        );
        currentDescription = "";
      }
      currentDescription += description;
    });
    embeds.push(
      new EmbedBuilder()
        .setTitle("📚 Help Desk ⏳")
        .setDescription(currentDescription)
        .setThumbnail(IMG.CHAT_LOGO)
        .setFooter({
          text: "| 📄 See more documentation by clicking on the buttons corresponding to the emojis",
          iconURL: IMG.BELL_LOGO,
        })
        .setAuthor({
          name:
            `Asked by ${this._interaction.user.username} | ` +
            i++ +
            "/" +
            this._commandsTree.size,

          iconURL: this._interaction.user.avatarURL() || undefined,
        })
        .setColor("#5865F2")
    );

    this._response = await this._interaction.reply({
      embeds: embeds,
      components: [this.buildController()],
    });
    await this.launchController();
  }
}

class Category {
  _name: string;
  _emoji: string;
  _commands: Map<string, Command> = new Map<string, Command>();
  constructor(name: string, emoji: string, command: Command | null = null) {
    this._name = name;
    this._emoji = emoji;
    if (command) this._commands.set(command.description.name, command);
  }

  public addCommand(command: Command) {
    this._commands.set(command.description.name, command);
  }

  public get Commands() {
    return this._commands;
  }

  public get Description() {
    return CommandCategories.getCATEGORY(this._name).description;
  }
}
