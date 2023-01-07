import { TaskQueries } from "./task.queries";
import { execute } from "../../utils/mysql.connector";
import { Task } from "./task";
import { TaskAltered } from "./taskAltered";
import { getAvailableIdentifiant } from "../identifiant/identifiant.services";
import { MYSQL_TABLES } from "../../utils/mysql_tables.enum";

export const TaskServices = {
  getTaskByName: async (userId: string, content: string): Promise<Task> => {
    const result: Task[] = await execute(TaskQueries.GetTaskByName, [
      content,
      userId,
    ]);
    return result[0];
  },
  getTaskByNameNotEndend: async (
    userId: string,
    content: string
  ): Promise<Task> => {
    const result: Task[] = await execute(TaskQueries.GetTaskByNameNotEnded, [
      content,
      userId,
    ]);
    return result[0];
  },
  getTaskById: async (TId: string): Promise<Task> => {
    const result: Task[] = await execute(TaskQueries.GetTaskById, [TId]);
    return result[0];
  },
  getTasksByActivityId: async (AId: string): Promise<Task[]> => {
    const result: Task[] = await execute(
      TaskQueries.GetTasksNotEndedByActivityId,
      [AId]
    );
    return result;
  },

  GetTasksAlteredEndedByActivityId: async (
    AId: string
  ): Promise<TaskAltered[]> => {
    const result: TaskAltered[] = await execute(
      TaskQueries.GetTasksAlteredEndedByActivityId,
      [AId]
    );
    return result;
  },

  GetTasksALteredByCategoryIdNotEnded: async (
    TCId: string
  ): Promise<TaskAltered[]> => {
    const result: TaskAltered[] = await execute(
      TaskQueries.GetTasksAlteredByCategoryIdNotEnded,
      [TCId]
    );
    return result;
  },

  getTasksByUserId: async (userId: string): Promise<Task[]> => {
    const result: Task[] = await execute(TaskQueries.GetTasksByUserId, [
      userId,
    ]);
    return result;
  },
  insertTask: async (
    content: string,
    entryDate: Date,
    endDate: Date | null,
    TCId: string | null,
    AId: string | null
  ): Promise<number> => {
    let TId = await getAvailableIdentifiant(MYSQL_TABLES.Task);
    // If a task with the same name already with the same category or activity exists, we add a number at the end of the name
    await execute(TaskQueries.InsertTask, [
      TId,
      content,
      entryDate,
      endDate,
      TCId,
      AId,
    ]);
    return 0;
  },
  endTask: async (TId: string, endDate: Date): Promise<number> => {
    await execute(TaskQueries.EndTask, [endDate, TId]);
    return 0;
  },
  removeTask: async (TId: string): Promise<number> => {
    await execute(TaskQueries.DeleteTask, [TId]);
    return 0;
  },
  isDuplicateTaskFromActivity: async (
    content: string,
    AId: string,
    TCId: string
  ): Promise<boolean> => {
    const result: Task[] = await execute(
      TaskQueries.IsDuplicateTaskFromActivity,
      [content, AId, TCId]
    );
    return result.length > 0;
  },
  isDuplicateTaskFromCategory: async (
    content: string,
    TCId: string | null
  ): Promise<boolean> => {
    const result: Task[] = await execute(
      TaskQueries.IsDuplicateTaskFromTCategory,
      [content, TCId]
    );

    return result.length > 0;
  },
};
