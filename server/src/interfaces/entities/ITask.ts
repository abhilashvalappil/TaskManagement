import { Document, Types } from "mongoose";

export interface ITask extends Document {
    _id: Types.ObjectId;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed";
    priority: "low" | "medium" | "high";
    dueDate?: Date;
    assignees: string[];
    attachments: string[];
    userId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    completedAt?: Date;
}
