import { Client } from "discord.js";
import ReminderScheduler from "./ReminderScheduler";

require("dotenv").config();

let reminderScheduler: ReminderScheduler | null = null;

const fireListener = async (client: Client) => {
  // Stop any existing scheduler
  if (reminderScheduler) {
    reminderScheduler.stop();
  }

  // Create and start the new scheduler
  reminderScheduler = new ReminderScheduler(client);
  await reminderScheduler.start();

  console.log("ReminderScheduler started successfully");
};

// Export the scheduler instance so it can be used elsewhere
export const getReminderScheduler = (): ReminderScheduler | null => {
  return reminderScheduler;
};

export default fireListener;
