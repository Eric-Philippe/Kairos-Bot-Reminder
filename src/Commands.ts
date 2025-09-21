import { readdirSync, existsSync } from "fs";
import * as path from "path";

import { Command } from "./CommandTemplate";

const Commands: Command[] = [];

// Determine if we're in development or production
const isDev = __dirname.includes("src");
const commandsPath = isDev
  ? path.join(__dirname, "commands")
  : path.join(__dirname, "commands");

// Use appropriate file extension based on environment
const fileExtension = isDev ? ".ts" : ".js";

// Check if commands directory exists
if (existsSync(commandsPath)) {
  // Loop through all the commands folder with appropriate extension
  readdirSync(commandsPath)
    .filter((file) => file.endsWith(fileExtension))
    .forEach((file) => {
      // Get the command from the file
      const command = require(path.join(commandsPath, file)).default;
      // Add the command to the commands array
      Commands.push(command);
    });
}

export default Commands;
