// Blueprint of a command category
export interface CommandsCategory {
  name: string;
  description: string;
  emoji: string;
}

export class CommandCategories {
  public static get GENERAL(): CommandsCategory {
    return {
      name: "General",
      description: "Generic commands to set up preferences",
      emoji: "📁",
    };
  }
  public static get REMINDME(): CommandsCategory {
    return {
      name: "Remindme",
      description: "Commands to manage your Remindme reminders",
      emoji: "🔔",
    };
  }
  public static get REMINDUS(): CommandsCategory {
    return {
      name: "Remindus",
      description: "Commands to manage your Remindus reminders",
      emoji: "🛎️",
    };
  }
  public static get TIMETRACKER(): CommandsCategory {
    return {
      name: "Timetracker",
      description: "Commands to track time spent",
      emoji: "⏱️",
    };
  }
  public static getCATEGORY(categoryName: string): CommandsCategory {
    switch (categoryName) {
      case "General":
        return this.GENERAL;
      case "Remindme":
        return this.REMINDME;
      case "Remindus":
        return this.REMINDUS;
      case "Timetracker":
        return this.TIMETRACKER;
      default:
        return this.GENERAL;
    }
  }
}
