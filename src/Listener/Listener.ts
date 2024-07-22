import { Client } from "discord.js";

var cron = require("node-cron");

import FireRemindmeQueue from "./fire.remindme.queue";
import FireRemindusQueue from "./fire.remindus.queue";
// import Logger from "../logs/Logger";

require("dotenv").config();

const fireListener = async (client: Client) => {
  // Run every minute
  cron.schedule("*/1 * * * *", async () => {
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
  });
};

export default fireListener;
