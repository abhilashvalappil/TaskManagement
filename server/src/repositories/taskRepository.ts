import { ITask } from "../interfaces/entities/ITask";
import { ITaskRepository } from "../interfaces/repositoryInterfaces/ITaskRepository";
import TaskModel from "../models/taskModel";

class TaskRepository implements ITaskRepository {
    constructor(){  
    }

    async create(task: Partial<ITask>): Promise<ITask> {
        const newTask = new TaskModel(task);
        return await newTask.save();
    }

    async findByUserId(userId: string): Promise<ITask[]> {
        return await TaskModel.find({ userId });
    }
}

export default new TaskRepository();