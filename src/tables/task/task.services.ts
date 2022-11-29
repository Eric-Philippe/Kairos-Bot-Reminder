import { TaskQueries } from "./task.queries";
import { execute } from "../../utils/mysql.connector";
import { Task } from "./task";

export const TaskServices = {
  getTasksByActivityId: async (AId: string): Promise<Task[]> => {
    const result: Task[] = await execute(TaskQueries.GetTasksByActivityId, [
      AId,
    ]);
    return result;
  },
  getTaskById: async (TId: string): Promise<Task> => {
    const result: Task[] = await execute(TaskQueries.GetTaskById, [TId]);
    return result[0];
  },
  addTask: async (
    TId: string,
    AId: string,
    name: string,
    description: string,
    dueDate: string,
    isComplete: boolean,
    isRecurring: boolean
  ): Promise<number> => {
    await execute(TaskQueries.AddTask, [
      TId,
      AId,
      name,
      description,
      dueDate,
      isComplete,
      isRecurring,
    ]);
    return 0;
  },
  removeTask: async (TId: string): Promise<number> => {
    await execute(TaskQueries.DeleteTask, [TId]);
    return 0;
  },
};
