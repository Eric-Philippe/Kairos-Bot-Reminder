import { Client } from "discord.js";
import FireRemindmeQueue from "./fire.remindme.queue";
import FireRemindusQueue from "./fire.remindus.queue";
// import Logger from "../logs/Logger";

require("dotenv").config();

const fireListener = async (client: Client) => {
  setInterval(async () => {
    try {
      const remindmeQueue = new FireRemindmeQueue();
      remindmeQueue.fire(client);
    } catch (error) {
      console.log(error);
    }

    try {
      const remindusQueue = new FireRemindusQueue();
      remindusQueue.fire(client);
    } catch (error) {
      console.log(error);
    }
  }, 1000 * 60); // 1 minute;
};

export default fireListener;
