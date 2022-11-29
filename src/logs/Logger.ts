import fs from "fs";
import path from "path";
import { LogType } from "./type.enum";
const logFilePath = path.join(__dirname, "..", "..", "Logs.log");
/**
 * Singleton class for logging.
 */
export default class Logger {
  private static instance: Logger;
  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }

    return Logger.instance;
  }
  /**
   *
   * @param msg Message to log
   * @param type {0: info, 1: warning, 2: error}
   */
  public async log(
    msg: string,
    type?: string,
    currentFilePath?: string
  ): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      let logType = type ? type : LogType.INFO;
      let content = `[${logType}] ${new Date().toISOString()} - ${msg}`;
      if (currentFilePath) content += ` - AT ${currentFilePath}`;
      try {
        fs.appendFileSync(logFilePath, content + "\n", { encoding: "utf-8" });
        resolve(0);
      } catch (error) {
        reject(1);
      }
    });
  }
}
