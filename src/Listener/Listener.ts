import { Client } from "discord.js";
import FireRemindmeQueue from "./fire.remindme.queue";
import FireRemindusQueue from "./fire.remindus.queue";
import Logger from "src/logs/Logger";

require("dotenv").config();

const fireListener = async (client: Client) => {
  setInterval(async () => {
    const remindmeQueue = new FireRemindmeQueue();
    const remindusQueue = new FireRemindusQueue();

    try {
      await Promise.all([
        remindmeQueue.fire(client),
        remindusQueue.fire(client),
      ]);
    } catch (error) {
      console.log(error);
      Logger.getInstance().log("ERROR IN FIRE LISTENER", "error");
    }
  }, 1000 * 20);
};

export default fireListener;
