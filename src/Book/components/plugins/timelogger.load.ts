import CategoryData from "./timelogger.data";
import { TCategoryServices } from "../../../tables/tcategory/tcategory.services";
import { ActivityServices } from "../../../tables/activity/activity.services";
import { TaskServices } from "../../../tables/task/task.services";
import { TaskAltered } from "../../../tables/task/taskAltered";
import { Activity } from "../../../tables/activity/activity";
import { TCategory } from "src/tables/tcategory/tcategory";
import DateWorker from "../../../utils/date.worker";
import { Task } from "../../../tables/task/task";
/**
 * This class is used to load the data from the database to the timelogger
 */
export default class TimeLoggerLoad {
  static async loadCategories(
    userId: string,
    keyword: string
  ): Promise<CategoryData[] | null> {
    const categories = await TCategoryServices.getCategoryByKeywordUserId(
      keyword,
      userId
    );
    if (categories.length === 0) return null;
    const categoriesData: CategoryData[] = [];
    for (const category of categories) {
      const categoryData = new CategoryData(category.title);
      const activities = await ActivityServices.getActivitiesByCategoryId(
        category.TCId
      );
      for (const activity of activities) {
        const activityData = categoryData.addActivity(activity.name);
        const tasks = await TaskServices.GetTasksAlteredEndedByActivityId(
          activity.AId
        );
        for (const task of tasks) {
          categoryData.addTaskToActivity(
            activity.name,
            task.content,
            task.timeElapsed
          );
        }
      }

      // Get the tasks that are not linked to an activity
      const tasks = await TaskServices.GetTasksALteredByCategoryIdNotEnded(
        category.TCId
      );

      for (const task of tasks) {
        categoryData.addTaskToCategory(task.content, task.timeElapsed);
      }

      categoriesData.push(categoryData);
    }
    return categoriesData;
  }

  static async loadCategory(
    userId: string,
    categoryName: string
  ): Promise<CategoryData> {
    const category = await TCategoryServices.getTCategoryByTitleUserId(
      categoryName,
      userId
    );
    const categoryData = new CategoryData(category.title);
    const activities = await ActivityServices.getActivitiesByCategoryId(
      category.TCId
    );
    for (const activity of activities) {
      const activityData = categoryData.addActivity(activity.name);
      const tasks = await TaskServices.GetTasksAlteredEndedByActivityId(
        activity.AId
      );
      for (const task of tasks) {
        categoryData.addTaskToActivity(
          activity.name,
          task.content,
          task.timeElapsed
        );
      }
    }
    // Get the tasks that are not linked to an activity
    const tasks = await TaskServices.GetTasksALteredByCategoryIdNotEnded(
      category.TCId
    );

    for (const task of tasks) {
      categoryData.addTaskToCategory(task.content, task.timeElapsed);
    }

    return categoryData;
  }

  static async loadAlteredTasksToCategory(
    tasks: TaskAltered[]
  ): Promise<CategoryData> {
    const category = new CategoryData("Tasks Found");
    for (const task of tasks) {
      category.addTaskToCategory(task.content, task.timeElapsed);
    }
    return category;
  }

  static async loadActivityToCategory(
    activity: Activity,
    isMultipleActivy: boolean = false
  ): Promise<CategoryData> {
    let title: string;
    if (!isMultipleActivy) title = "Activity " + activity.name + "'s analysis";
    else title = activity.name + "'s recap'";
    const category = new CategoryData(
      "Activity " + activity.name + "'s analysis"
    );
    const activityData = category.addActivity(activity.name);
    const tasks = await TaskServices.GetTasksAlteredEndedByActivityId(
      activity.AId
    );

    for (const task of tasks) {
      category.addTaskToActivity(activity.name, task.content, task.timeElapsed);
    }
    return category;
  }

  static async loadCategoriesDated(
    categoriesFounded: TCategory[],
    minDate: Date,
    maxDate: Date
  ): Promise<CategoryData[]> {
    const categoriesData: CategoryData[] = [];
    for (const category of categoriesFounded) {
      const categoryData = new CategoryData(category.title);
      const activitiesFounded =
        await ActivityServices.getActivitiesByCategoryId(category.TCId);
      // A map to store the activities and aggregate the activities with the same name
      let activities = new Map<string, Activity>();
      for (const activity of activitiesFounded) {
        activities.set(activity.AId, activity);
      }

      for (const AKey of activities.keys()) {
        let tasks = new Map<string, TaskAltered>();
        const tasksFromActivity = await TaskServices.getTasksByActivityId(AKey);
        for (const task of tasksFromActivity) {
          if (
            (task.entryDate >= minDate && task.endDate) ||
            new Date() <= maxDate
          ) {
            if (tasks.has(task.TId)) {
              const taskToModify = tasks.get(task.TId);
              if (taskToModify) {
                taskToModify.timeElapsed += DateWorker.getDateDifferentM(
                  task.entryDate,
                  task.endDate || task.entryDate
                );
                tasks.set(task.TId, taskToModify);
              }
            } else {
              tasks.set(task.TId, TaskToAltered(task));
            }
          }
        }
        categoryData.addActivity(activities.get(AKey)!.name);
        for (const TKey of tasks.keys()) {
          categoryData.addTaskToActivity(
            activities.get(AKey)!.name,
            tasks.get(TKey)!.content,
            tasks.get(TKey)!.timeElapsed
          );
        }
      }

      // Get the tasks that are not linked to an activity
      const tasks = await TaskServices.getTasksByCategoryId(category.TCId);
      let tasksCategory = new Map<string, TaskAltered>();
      for (const task of tasks) {
        if (
          (task.entryDate >= minDate && task.endDate) ||
          new Date() <= maxDate
        ) {
          if (tasksCategory.has(task.TId)) {
            const taskToModify = tasksCategory.get(task.TId);
            if (taskToModify) {
              taskToModify.timeElapsed += DateWorker.getDateDifferentM(
                task.entryDate,
                task.endDate || task.entryDate
              );
              tasksCategory.set(task.TId, taskToModify);
            }
          } else {
            tasksCategory.set(task.TId, TaskToAltered(task));
          }
        }
      }
      for (const TKey of tasksCategory.keys()) {
        categoryData.addTaskToCategory(
          tasksCategory.get(TKey)!.content,
          tasksCategory.get(TKey)!.timeElapsed
        );
      }
      categoriesData.push(categoryData);
    }
    return categoriesData;
  }
}

const TaskToAltered = (task: Task): TaskAltered => {
  return {
    content: task.content,
    AId: task.AId,
    TCId: task.TCId,
    TId: task.TId,
    timeElapsed: DateWorker.getDateDifferentM(
      task.entryDate,
      task.endDate || task.entryDate
    ),
  };
};
