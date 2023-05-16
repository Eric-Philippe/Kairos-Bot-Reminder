import { Client, EmbedBuilder, TextChannel, User } from "discord.js";

import Logger from "../logs/Logger";
import { LogType } from "../logs/type.enum";

import { RemindmeServices } from "../tables/remindme/remindme.services";
import { Remindme } from "../tables/remindme/remindme";

import { Repetition } from "../utils/repetition.enum";

import FireQueue from "./fire.model";
import RemindmeDisplay from "./build.remindmeDisplay";

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
    if (process.env.DEBUG_MODE == "true")
      console.log("Loading queue for remindme");

    this.Logger = Logger.getInstance();
    try {
      this.RemindmeQueue = await this.fetchForQueue();
    } catch (error) {
      console.log(error);
    }
    if (this.RemindmeQueue.length != 0)
      await this.Logger.log(
        `Found ${this.RemindmeQueue.length} remindus to send`,
        LogType.INFO
      );

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
            this.Logger.log(
              `Channel not found - ${remindus.meId}`,
              LogType.ERROR
            );
            continue;
          } else {
            await this.sendMsg(target as User, remindus);
            if (!remindus.repetition)
              return await RemindmeServices.removeRemindMe(remindus.meId);
            else {
              let currentRepetition = Object.values(Repetition).find(
                (rep) => rep.value == remindus.repetition
              );
              if (!currentRepetition)
                return this.Logger.log("Repetition not found");

              let nextDate = await currentRepetition.nextDate(
                remindus.targetDate
              );
              return await RemindmeServices.updateRemindme(remindus, nextDate);
            }
          }
        } catch (error) {
          // Stack Trace
          // Print Stack Trace
          console.log(error);
          throw error;
          await this.Logger.log(
            `Error sending remindus to ${remindus.meId} | Error: ${error}`,
            LogType.ERROR,
            __filename
          );
        }
      }
      res();
    });
  }
  public sendMsg(
    target: TextChannel | User,
    reminder: Remindme
  ): Promise<number> {
    return new Promise(async (res, rej) => {
      // Log the instance of the target
      if (target instanceof User) {
        try {
          let attachment = await RemindmeDisplay(reminder);
          let embed = new EmbedBuilder()
            .setTitle("⌛ | You have a new reminder ! ⌛")
            .setColor("#5865F2");

          await target.send({ embeds: [embed] });
          // Wait 2 seconds before sending the attachment
          await new Promise((res) => setTimeout(res, 2000));
          await target.send({ files: [attachment] });

          res(0);
        } catch (error) {
          rej(error);
        }
      }
    });
  }
}
