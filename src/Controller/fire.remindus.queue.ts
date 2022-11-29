import { Client, EmbedBuilder, TextChannel, User } from "discord.js";

import Logger from "../logs/Logger";
import { LogType } from "../logs/type.enum";

import { RemindusServices } from "../tables/remindus/remindus.services";
import { Remindus } from "../tables/remindus/remindus";

import { Repetition } from "../utils/repetition.enum";

import FireQueue from "./fire.model";

export default class FireRemindusQueue extends FireQueue {
  private RemindusQueue: Remindus[] = [];
  private Logger: Logger = Logger.getInstance();

  public async fetchForQueue(): Promise<Remindus[]> {
    return new Promise(async (res, rej) => {
      try {
        res(await RemindusServices.fetchPastRemindus());
      } catch (error) {
        rej(-1);
      }
    });
  }
  public async load(): Promise<number> {
    if (process.env.DEBUG_MODE == "true")
      console.log("Loading queue for remindus");

    this.Logger = Logger.getInstance();
    try {
      this.RemindusQueue = await this.fetchForQueue();
    } catch (error) {
      console.log(error);
    }
    if (this.RemindusQueue.length != 0)
      await this.Logger.log(
        `Found ${this.RemindusQueue.length} remindus to send`,
        LogType.INFO
      );

    return 0;
  }
  public async fire(client: Client): Promise<void> {
    return new Promise(async (res, rej) => {
      await this.load();
      if (this.RemindusQueue.length == 0) return res();
      for (let remindus of this.RemindusQueue) {
        try {
          let target = await client.channels.cache.get(remindus.channelId);
          if (!target) {
            await RemindusServices.removeRemindus(remindus.usId);
            this.Logger.log(
              `Channel not found - ${remindus.usId}`,
              LogType.ERROR
            );
            continue;
          } else {
            await this.sendMsg(target as TextChannel, remindus);
            if (!remindus.repetition)
              return await RemindusServices.removeRemindus(remindus.usId);
            else {
              let currentRepetition = Object.values(Repetition).find(
                (rep) => rep.value == remindus.repetition
              );
              if (!currentRepetition)
                return this.Logger.log("Repetition not found");

              let nextDate = await currentRepetition.nextDate(
                remindus.targetDate
              );
              return await RemindusServices.updateRemindus(remindus, nextDate);
            }
          }
        } catch (error) {
          await this.Logger.log(
            `Error sending remindus to ${remindus.usId}`,
            LogType.ERROR,
            __filename
          );
          rej(-2);
        }
      }
      res();
    });
  }
  public async sendMsg(
    target: TextChannel | User,
    reminder: Remindus
  ): Promise<number> {
    return new Promise(async (res, rej) => {
      if (target instanceof TextChannel) {
        try {
          let embed = new EmbedBuilder()
            .setTitle("Remindus")
            .setDescription(reminder.content)
            .setColor("Aqua");

          await target.send({ embeds: [embed] });

          res(0);
        } catch (error) {
          rej(-3);
        }
      }
    });
  }
}
