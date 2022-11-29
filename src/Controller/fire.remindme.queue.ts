import { Client, EmbedBuilder, TextChannel, User } from "discord.js";

import Logger from "../logs/Logger";
import { LogType } from "../logs/type.enum";

import { RemindmeServices } from "../tables/remindme/remindme.services";
import { Remindme } from "../tables/remindme/remindme";

import { Repetition } from "../utils/repetition.enum";

import FireQueue from "./fire.model";

export default class FireRemindmeQueue implements FireQueue {
  private RemindmeQueue: Remindme[] = [];
  private Logger: Logger = Logger.getInstance();

  public async fetchForQueue(): Promise<Remindme[]> {
    return new Promise(async (res, rej) => {
      try {
        res(await RemindmeServices.fetchPastRemindme());
      } catch (error) {
        rej(-1);
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
          await this.Logger.log(
            `Error sending remindus to ${remindus.meId}`,
            LogType.ERROR,
            __filename
          );
          rej(-2);
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
          let embed = new EmbedBuilder()
            .setTitle("Remindme")
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
