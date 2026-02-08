import { CreateTaskData, CreateTaskResult, UpdateTaskData, UpdateTaskRequest } from "../../types/taskTypes";
import { ITask } from "../entities/ITask";

export interface ITaskService {
    createTask(taskData: CreateTaskData): Promise<CreateTaskResult>;
    getTasks(userId: string): Promise<{tasks: ITask[]}>;
    updateTask(taskId: string, userId: string,updateData: UpdateTaskRequest,files: Express.Multer.File[]): Promise<ITask | null>
    deleteTask(taskId: string, userId: string): Promise<boolean>
    getAnalytics(userId: string): Promise<any>
}