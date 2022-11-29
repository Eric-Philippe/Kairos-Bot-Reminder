import { readdirSync } from "fs";
import * as path from "path";

import { Command } from "./CommandTemplate";

const Commands: Command[] = [];
// Loop through all the commands folder with a .js extension only
readdirSync(path.join(__dirname, "commands"))
  .filter((file) => file.endsWith(".js"))
  .forEach((file) => {
    // Get the command from the file
    const command = require(path.join(__dirname, "commands", file)).default;
    // Add the command to the commands array
    Commands.push(command);
  });

export default Commands;
