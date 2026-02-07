import { Types } from "mongoose";
import { ITask } from "../interfaces/entities/ITask";


export interface CreateTaskData {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    dueDate: Date;
    assignees?: string[];
    attachments?: string[];
    files?: Express.Multer.File[];
    userId: Types.ObjectId;
}

export interface CreateTaskResult {
    message: string;
    task: ITask;
}

 