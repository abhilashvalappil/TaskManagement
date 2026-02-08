import { ITask } from "../interfaces/entities/ITask";
import { ITaskRepository } from "../interfaces/repositoryInterfaces/ITaskRepository";
import TaskModel from "../models/taskModel";
import { UpdateTaskData } from "../types/taskTypes";

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

    async updateTask(taskId: string, userId: string,updateData: UpdateTaskData): Promise<ITask | null> {
        return await TaskModel.findOneAndUpdate({ _id: taskId, userId },updateData,{new:true});
    }
}

export default new TaskRepository();