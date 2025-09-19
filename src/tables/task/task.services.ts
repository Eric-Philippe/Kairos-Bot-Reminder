import { TaskQueries } from "./task.queries";
import { execute } from "../../database/mysql.connector";
import { Task } from "./task";
import { TaskAltered } from "./taskAltered";
import { getAvailableIdentifiant } from "../identifiant/identifiant.services";
import { MYSQL_TABLES } from "../../database/mysql_tables.enum";
import { TaskWParent } from "./taskWParent";

export const TaskServices = {
  getTaskByName: async (userId: string, content: string): Promise<Task> => {
    const result: Task[] = await execute(TaskQueries.GetTaskByName, [
      content,
      userId,
    ]);
    return result[0];
  },
  getTasksByCategoryId: async (TCId: string): Promise<Task[]> => {
    const result: Task[] = await execute(TaskQueries.GetTasksByCategory, [
      TCId,
    ]);
    return result;
  },
  getTaskByNameNotEndend: async (
    userId: string,
    content: string
  ): Promise<Task> => {
    const result: Task[] = await execute(TaskQueries.GetTaskByNameNotEnded, [
      userId,
      content,
    ]);

    return result[0];
  },
  getTasksByKeywordUserId: async (
    keyword: string,
    userId: string
  ): Promise<TaskWParent[]> => {
    let keywordSQL = keyword.replace(/ /g, "%");
    keywordSQL = "%" + keywordSQL + "%";
    const result: TaskWParent[] = await execute(
      TaskQueries.GetTasksByKeywordUserId,
      [keywordSQL, userId, userId]
    );
    return result;
  },
  getTasksEndedByKeywordUserId: async (
    keyword: string,
    userId: string
  ): Promise<TaskWParent[]> => {
    let keywordSQL = keyword.replace(/ /g, "%");
    keywordSQL = "%" + keywordSQL + "%";
    const result: TaskWParent[] = await execute(
      TaskQueries.GetTasksByKeywordUserIdEnded,
      [keywordSQL, userId, userId]
    );
    return result;
  },
  getTasksNotEndedByKeywordUserId: async (
    keyword: string,
    userId: string
  ): Promise<TaskWParent[]> => {
    let keywordSQL = keyword.replace(/ /g, "%");
    keywordSQL = "%" + keywordSQL + "%";
    const result: TaskWParent[] = await execute(
      TaskQueries.GetTasksNotEndedByKeywordUserId,
      [keywordSQL, userId, userId]
    );
    return result;
  },
  getTaskById: async (TId: string): Promise<Task> => {
    const result: Task[] = await execute(TaskQueries.GetTaskById, [TId]);
    return result[0];
  },
  getTasksByIdUserId: async (TId: string, userId: string): Promise<Task> => {
    const result: Task[] = await execute(TaskQueries.GetTaskByIdUserId, [
      TId,
      userId,
    ]);
    return result[0];
  },
  getTasksByActivityIdEnded: async (AId: string): Promise<Task[]> => {
    const result: Task[] = await execute(
      TaskQueries.GetTasksNotEndedByActivityId,
      [AId]
    );
    return result;
  },
  getTasksByActivityId: async (AId: string): Promise<Task[]> => {
    const result: Task[] = await execute(TaskQueries.GetTasksByActivityId, [
      AId,
    ]);
    return result;
  },
  getTaskByContentUserIdEnded: async (
    userId: string,
    content: string
  ): Promise<Task> => {
    const result: Task[] = await execute(
      TaskQueries.GetTaskByContentUserIdEnded,
      [content, userId]
    );
    return result[0];
  },

  getTasksByKeywordUserIdEnded: async (
    userId: string,
    keyword: string
  ): Promise<TaskAltered[]> => {
    let keywordSQL = keyword.replace(/ /g, "%");
    keywordSQL = "%" + keywordSQL + "%";
    const result: TaskAltered[] = await execute(
      TaskQueries.GetTasksByKeywordUserIdEnded,
      [keywordSQL, userId]
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
