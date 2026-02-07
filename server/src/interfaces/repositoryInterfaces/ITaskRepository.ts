import { ITask } from "../entities/ITask";

export interface ITaskRepository {
    create(task: Partial<ITask>): Promise<ITask>;
    findByUserId(userId: string): Promise<ITask[]>;
}