import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Client,
  ComponentType,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  TextChannel,
  User,
} from "discord.js";

import { LogType } from "../logs/type.enum";

import { RemindmeServices } from "../tables/remindme/remindme.services";
import { Remindme } from "../tables/remindme/remindme";

import { Repetition } from "../utils/repetition.enum";

import FireQueue from "./fire.model";
import RemindmeDisplay from "./build.remindmeDisplay";
import Logger from "../logs/Logger";

export default class FireRemindmeQueue implements FireQueue {
  private RemindmeQueue: Remindme[] = [];
  private Logger: Logger = Logger.getInstance();

  public async fetchForQueue(): Promise<Remindme[]> {
    return new Promise(async (res, rej) => {
      try {
        res(await RemindmeServices.fetchPastRemindme());
      } catch (error) {
        rej(error);
      }
    });
  }
  public async load(): Promise<number> {
    try {
      this.RemindmeQueue = await this.fetchForQueue();
    } catch (error) {
      console.log(error);
    }

    return 0;
  }
  public fire(client: Client): Promise<void> {
    return new Promise(async (res, rej) => {
      await this.load();
      if (this.RemindmeQueue.length == 0) return res();
      for (let remindus of this.RemindmeQueue) {
        try {
          let target = await client.users.cache.get(remindus.userId);
          if (!target) {
            await RemindmeServices.removeRemindMe(remindus.meId);
            continue;
          } else {
            await this.sendMsg(target as User, remindus);
            if (!remindus.repetition)
              return await RemindmeServices.removeRemindMe(remindus.meId);
            else {
              let currentRepetition = Object.values(Repetition).find(
                (rep) => rep.value == remindus.repetition
              );
              if (!currentRepetition) return;

              let nextDate = await currentRepetition.nextDate(
                remindus.targetDate
              );
              return await RemindmeServices.updateRemindme(remindus, nextDate);
            }
          }
        } catch (error) {
          Logger.getInstance().log(
            "Error while sending remindme to user " + remindus.userId,
            LogType.ERROR
          );
          continue;
        }
      }
      res();
    });
  }
  public async sendMsg(
    target: TextChannel | User,
    reminder: Remindme
  ): Promise<number> {
    return new Promise(async (res, rej) => {
      if (target instanceof User) {
        try {
          let attachment = await RemindmeDisplay(reminder);
          let embed = new EmbedBuilder()
            .setTitle("⌛ | You have a new reminder ! ⌛")
            .setColor("#5865F2");

          // Create a button for snoozing the reminder
          const snoozeButton = new ButtonBuilder()
            .setCustomId("snooze")
            .setLabel("Snooze")
            .setStyle(ButtonStyle.Primary);

          const row =
            new ActionRowBuilder() as ActionRowBuilder<MessageActionRowComponentBuilder>;
          row.addComponents(snoozeButton);

          await target.send({ embeds: [embed] });

          // Wait 2 seconds before sending the attachment
          await new Promise((res) => setTimeout(res, 2000));
          const msg = await target.send({
            files: [attachment],
            components: [row],
          });

          res(0);

          /**
           * Snooze button
           * We will listen for the button click
           * If nothing is done for 30 minutes, the snooze button will be removed
           * If it's clicked, we will show a list of snooze options (10 minutes, 1h, 8h, TOMORROW)
           * If the user clicks on one of the options, we will recreate the reminder with the new date
           */
          try {
            const snoozeResult = await msg.awaitMessageComponent({
              time: 1800000,
              componentType: ComponentType.Button,
            });

            if (snoozeResult.isButton()) {
              const buttonInteraction = snoozeResult as ButtonInteraction;
              if (buttonInteraction.customId === "snooze") {
                // Snooze button clicked
                await buttonInteraction.deferUpdate();
                await buttonInteraction.editReply({
                  content: "Snooze options",
                  components: [],
                });

                const snoozeOptions = [
                  {
                    label: "10 minutes",
                    value: 10,
                  },
                  {
                    label: "1 hour",
                    value: 60,
                  },
                  {
                    label: "8 hours",
                    value: 480,
                  },
                  {
                    label: "Tomorrow",
                    value: 1440,
                  },
                ];

                const snoozeRow =
                  new ActionRowBuilder() as ActionRowBuilder<ButtonBuilder>;
                for (const option of snoozeOptions) {
                  const button = new ButtonBuilder()
                    .setCustomId(`snooze_${option.value}`)
                    .setLabel(option.label)
                    .setStyle(ButtonStyle.Primary);
                  snoozeRow.addComponents(button);
                }

                await buttonInteraction.editReply({
                  components: [snoozeRow],
                });

                const snoozeResult = await msg.awaitMessageComponent({
                  time: 60000,
                  componentType: ComponentType.Button,
                });

                if (snoozeResult.isButton()) {
                  const buttonInteraction = snoozeResult as ButtonInteraction;
                  const value = parseInt(
                    buttonInteraction.customId.split("_")[1]
                  );
                  if (value) {
                    const nextDate = new Date(
                      reminder.targetDate.getTime() + value * 60000
                    );
                    await RemindmeServices.addRemindMe(
                      reminder.content,
                      reminder.description,
                      reminder.entryDate,
                      nextDate,
                      reminder.repetition,
                      0,
                      reminder.RCId,
                      reminder.userId
                    );

                    const snoozeEmbed = new EmbedBuilder()
                      .setTitle("⌛ | Reminder snoozed ! ⌛")
                      .setColor("#5865F2")
                      .setDescription(`Snoozed for ${value} minutes`);

                    await buttonInteraction.reply({
                      content: `Snoozed for ${value} minutes`,
                      components: [],
                    });

                    await msg.edit({
                      components: [],
                      embeds: [snoozeEmbed],
                    });
                  }
                }
              }
            }
          } catch (error) {
            console.log(error);
          }
        } catch (error) {
          // Delete the remindme if we can't send the message
          await RemindmeServices.removeRemindMe(reminder.meId);
          console.log("Can't send message to user " + target.id);
          return rej(error);
        }
      }
    });
  }
}
