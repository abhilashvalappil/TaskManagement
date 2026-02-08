import { UpdateTaskData } from "../../types/taskTypes";
import { ITask } from "../entities/ITask";

export interface ITaskRepository {
    create(task: Partial<ITask>): Promise<ITask>;
    findByUserId(userId: string): Promise<ITask[]>;
    updateTask(taskId: string, userId: string,updateData: UpdateTaskData): Promise<ITask | null>;
}