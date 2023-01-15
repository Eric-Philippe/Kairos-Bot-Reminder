import DateWorker from "../../../utils/date.worker";
// interface TaskTL {
//   content: string;
//   totalElapsed: number;
// }
/**
 * Class that describes a category of tasks
 * @class
 */
export default class CategoryData {
  title: string;
  activities: Map<string, Map<string, number>> = new Map();
  tasks: Map<string, number> = new Map();
  /**
   * @alias Category
   * @param title
   * @constructor
   */
  constructor(title: string) {
    this.title = title;
  }
  /**
   * Add a new activity to the category
   * @param activityName
   * @param aggregate
   * @returns
   */
  addActivity(
    activityName: string,
    aggregate: boolean = true
  ): Map<string, number> {
    if (this.activities.has(activityName) && !aggregate) {
      let i = 1;
      while (this.activities.has(activityName + i)) i++;
      activityName += i;
    }
    this.activities.set(activityName, new Map());
    return this.activities.get(activityName)!;
  }
  /**
   * Add a new task to the activity
   * @param activityName
   * @param content
   * @param totalElapsed
   * @param aggregate
   */
  addTaskToActivity(
    activityName: string,
    content: string,
    totalElapsed: number,
    aggregate: boolean = true
  ) {
    if (!this.activities.has(activityName)) {
      this.addActivity(activityName);
    }
    let activity = this.activities.get(activityName)!;
    if (activity.has(content)) {
      if (aggregate) {
        totalElapsed += activity.get(content)!;
      } else {
        let i = 1;
        while (activity.has(content + i)) i++;
        content += i;
      }
    }
    activity.set(content, totalElapsed);
  }
  /**
   * Add a new task to the category
   * @param content
   * @param totalElapsed
   * @param aggregate
   */
  addTaskToCategory(
    content: string,
    totalElapsed: number,
    aggregate: boolean = true
  ) {
    if (this.tasks.has(content)) {
      if (aggregate) {
        totalElapsed += this.tasks.get(content)!;
      } else {
        let i = 1;
        while (this.tasks.has(content + i)) i++;
        content += i;
      }
    }
    this.tasks.set(content, totalElapsed);
  }
  /**
   * Get the total elapsed time of the category
   */
  getTotalElapsed(): number {
    let totalElapsed = 0;
    this.activities.forEach((activity) => {
      activity.forEach((task) => {
        totalElapsed += task;
      });
    });
    this.tasks.forEach((task) => {
      totalElapsed += task;
    });
    return totalElapsed;
  }
  /**
   * Get the total elapsed time of the activity
   * @param activityName
   * @returns
   */
  getTotalElapsedOfActivity(activityName: string): number {
    let totalElapsed = 0;
    if (this.activities.has(activityName)) {
      this.activities.get(activityName)!.forEach((task) => {
        totalElapsed += task;
      });
    }
    return totalElapsed;
  }
  /**
   * Get the category name and the total elapsed time
   */
  getSummary(): Array<string> {
    return [this.title, DateWorker.timeToReadable(this.getTotalElapsed())];
  }
  /**
   * Get the activity name and the total elapsed time
   */
  getSummaryOfActivity(activityName: string): Array<string> {
    return [
      activityName,
      DateWorker.timeToReadable(this.getTotalElapsedOfActivity(activityName)),
    ];
  }
  /**
   * Get the task name and the total elapsed time
   */
  getSummaryOfTaskActivity(
    taskName: string,
    activityName: string
  ): Array<string> {
    if (this.activities.has(activityName)) {
      let activity = this.activities.get(activityName)!;
      if (activity.has(taskName)) {
        return [taskName, DateWorker.timeToReadable(activity.get(taskName)!)];
      }
    }
    return ["", ""];
  }
  /**
   * Get the task name and the total elapsed time of the category
   */
  getSummaryOfTaskCategory(taskName: string): Array<string> {
    if (this.tasks.has(taskName)) {
      return [taskName, DateWorker.timeToReadable(this.tasks.get(taskName)!)];
    }
    return ["", ""];
  }
  /**
   * Get an array of all the time elapsed for the activities
   */
  getActivitiesTimeArray(): Array<number> {
    let result: Array<number> = [];
    this.activities.forEach((activity, key) => {
      result.push(this.getTotalElapsedOfActivity(key));
    });
    return result;
  }
  /**
   * Get an array of all the name of the activities
   */
  getActivitiesNameArray(): Array<string> {
    let result: Array<string> = [];
    this.activities.forEach((activity, key) => {
      result.push(key);
    });
    return result;
  }
  /**
   * Get an array of all the time elapsed for the tasks
   */
  getTasksTimeArray(): Array<number> {
    let result: Array<number> = [];
    this.tasks.forEach((task) => {
      result.push(task);
    });
    this.activities.forEach((activity) => {
      activity.forEach((task) => {
        result.push(task);
      });
    });
    return result;
  }
  /**
   * Get an array of all the name of the tasks
   */
  getTasksNameArray(): Array<string> {
    let result: Array<string> = [];
    this.tasks.forEach((task, key) => {
      result.push(key);
    });
    this.activities.forEach((activity, key) => {
      activity.forEach((task, key) => {
        result.push(key);
      });
    });
    return result;
  }

  /**
   * Getter of the activities
   */
  getActivities(): Map<string, Map<string, number>> {
    return this.activities;
  }
  /**
   * Getter of the tasks
   */
  getTasks(): Map<string, number> {
    return this.tasks;
  }
  /**
   * Get all the tasks [Inside the category itself and all the tasks of the activities]
   */
  getAllTasks(): Map<string, number> {
    let result = new Map<string, number>();
    this.tasks.forEach((task, key) => {
      result.set(key, task);
    });
    this.activities.forEach((activity) => {
      activity.forEach((task, key) => {
        result.set(key, task);
      });
    });
    return result;
  }
  /**
   * Get the name of the category
   */
  getTitle(): string {
    return this.title;
  }
  /**
   * toString method
   * @returns
   * @override
   */
  toString() {
    let result = `:large_orange_diamond: Category: **${
      this.title
    }** - ${DateWorker.timeToReadable(this.getTotalElapsed())}\n`;
    this.activities.forEach((activity, activityName) => {
      result +=
        `\n:small_orange_diamond: Activity : ${activityName} - ` +
        "``" +
        `${DateWorker.timeToReadable(
          this.getTotalElapsedOfActivity(activityName)
        )}` +
        "``\n";
      activity.forEach((task, content) => {
        result +=
          `:small_orange_diamond::small_blue_diamond: Task : *${content}* - ` +
          "``" +
          `${task > 0 ? DateWorker.timeToReadable(task) : "Not terminated"}` +
          "``\n";
      });
    });
    this.tasks.forEach((task, content) => {
      result +=
        `\n:small_blue_diamond: Task : ${content} - ` +
        "``" +
        `${task > 0 ? DateWorker.timeToReadable(task) : "Not terminated"}` +
        "``\n";
    });
    return result;
  }
}
