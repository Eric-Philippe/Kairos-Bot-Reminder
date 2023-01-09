import { Client } from "discord.js";
import FireRemindmeQueue from "./fire.remindme.queue";
import FireRemindusQueue from "./fire.remindus.queue";

require("dotenv").config();

const cronitor = require("cronitor")(process.env.CRONTAB_KEY);
const monitor = new cronitor.Monitor("important-heartbeat-monitor");

const fireListener = async (client: Client) => {
  setInterval(async () => {
    const remindmeQueue = new FireRemindmeQueue();
    const remindusQueue = new FireRemindusQueue();

    try {
      const backValues = await Promise.all([
        remindmeQueue.fire(client),
        remindusQueue.fire(client),
      ]);
      monitor.ping({ message: "Alive" });
    } catch (error) {
      monitor.ping({ count: 2, error_count: 2 });
    }
  }, 1000 * 20);
};

export default fireListener;
