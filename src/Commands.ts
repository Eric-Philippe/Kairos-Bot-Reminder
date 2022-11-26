import { Command } from "./types";
import { Time } from "./commands/time";
import { Test } from "./commands/test";

export const Commands: Command[] = [Time, Test];
