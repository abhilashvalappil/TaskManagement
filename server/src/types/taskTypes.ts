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

export interface UpdateTaskData {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    status?: "pending" | "in_progress" | "completed";
    dueDate?: Date;
    assignees?: string[];
    attachments?: string[];
}

export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    priority?: "low" | "medium" | "high";
    status?: "pending" | "in_progress" | "completed";
    dueDate?: string;              
    assignees?: string[];
    existingAttachments?: string[]; 
}


 