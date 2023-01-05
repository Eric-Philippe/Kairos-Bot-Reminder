import { Client, TextChannel, User } from "discord.js";

export default abstract class FireQueue {
  /**
   * Method to add a new reminder to the queue
   */
  abstract fetchForQueue(): Promise<Object[]>;
  /**
   * Load the queue
   */
  abstract load(): Promise<number>;
  /**
   * Main launcher to fire the listener
   * @returns Promise<void>
   */
  abstract fire(client: Client): Promise<void>;
  /**
   * Send the reminder object to the destination
   * @param channel
   * @param reminder
   * @returns Promise<void>
   */
  abstract sendMsg(
    channel: TextChannel | User,
    reminder: Object
  ): Promise<number>;
}
