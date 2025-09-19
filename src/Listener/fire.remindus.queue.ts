import { Client, EmbedBuilder, TextChannel, User } from "discord.js";

import Logger from "../logs/Logger";
import { LogType } from "../logs/type.enum";

import { RemindusServices } from "../tables/remindus/remindus.services";
import { Remindus } from "../tables/remindus/remindus";

import { Repetition } from "../utils/repetition.enum";

import FireQueue from "./fire.model";
import RemindusDisplay from "./build.remindusDisplay";

export default class FireRemindusQueue extends FireQueue {
  private RemindusQueue: Remindus[] = [];
  private Logger: Logger = Logger.getInstance();

  public async fetchForQueue(): Promise<Remindus[]> {
    return new Promise(async (res, rej) => {
      try {
        res(await RemindusServices.fetchPastRemindus());
      } catch (error) {
        rej(error);
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
      // console.log(`` + this.RemindusQueue.length + ` remindus to send`);
      for (let remindus of this.RemindusQueue) {
        // console.log(`Sending remindus to ${remindus.usId}`);
        try {
          let target = await client.channels.cache.get(remindus.channelId);
          if (!target) {
            await RemindusServices.removeRemindus(remindus.usId);
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
          // await this.Logger.log(
          //   `Error sending remindus to ${remindus.usId}`,
          //   LogType.ERROR,
          //   __filename
          // );
          await RemindusServices.removeRemindus(remindus.usId);
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
          let attachement = await RemindusDisplay(reminder);
          let embed = new EmbedBuilder()
            .setTitle("⌛ | You have a new reminder ! ⌛")
            .setColor("#5865F2");

          await target.send({ embeds: [embed] });
          await new Promise((res) => setTimeout(res, 2000));
          await target.send({ files: [attachement] });

          res(0);
        } catch (error) {
          rej(error);
        }
      }
    });
  }
}
