import { CreateTaskData, CreateTaskResult } from "../../types/taskTypes";
import { ITask } from "../entities/ITask";

export interface ITaskService {
    createTask(taskData: CreateTaskData): Promise<CreateTaskResult>;
    getTasks(userId: string): Promise<{tasks: ITask[]}>;
}