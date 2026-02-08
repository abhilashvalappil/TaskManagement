import { ITask } from "../interfaces/entities/ITask";
import { ITaskRepository } from "../interfaces/repositoryInterfaces/ITaskRepository";
import TaskModel from "../models/taskModel";
import { UpdateTaskData } from "../types/taskTypes";

class TaskRepository implements ITaskRepository {
    constructor() {
    }

    async create(task: Partial<ITask>): Promise<ITask> {
        const newTask = new TaskModel(task);
        return await newTask.save();
    }

    async findByUserId(userId: string): Promise<ITask[]> {
        return await TaskModel.find({ userId });
    }

    // async updateTask(taskId: string, userId: string,updateData: UpdateTaskData): Promise<ITask | null> {
    //     return await TaskModel.findOneAndUpdate({ _id: taskId, userId },updateData,{new:true});
    // }
    async updateTask(taskId: string, userId: string, updateData: UpdateTaskData): Promise<ITask | null> {
        if (updateData.status === 'completed') {
            (updateData as any).completedAt = new Date();
        }
        return await TaskModel.findOneAndUpdate({ _id: taskId, userId }, updateData, { new: true });
    }

    async deleteTask(taskId: string, userId: string): Promise<boolean> {
        const result = await TaskModel.deleteOne({ _id: taskId, userId });
        return result.deletedCount > 0;
    }

    async getAnalytics(userId: string): Promise<any> {
        const userIdObj = new Types.ObjectId(userId);
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0, 0, 0, 0);

        const stats = await TaskModel.aggregate([
            { $match: { userId: userIdObj } },
            {
                $facet: {
                    byStatus: [
                        { $group: { _id: "$status", count: { $sum: 1 } } }
                    ],
                    byPriority: [
                        { $group: { _id: "$priority", count: { $sum: 1 } } }
                    ],
                    weeklyActivity: [
                        {
                            $match: {
                                createdAt: { $gte: startOfWeek }
                            }
                        },
                        {
                            $group: {
                                _id: {
                                    day: { $dayOfWeek: "$createdAt" },
                                    status: { $cond: [{ $eq: ["$status", "completed"] }, "completed", "created"] }
                                },
                                count: { $sum: 1 }
                            }
                        }
                    ],
                    avgCompletionTime: [
                        { $match: { status: "completed", completedAt: { $exists: true } } },
                        {
                            $project: {
                                duration: { $subtract: ["$completedAt", "$createdAt"] }
                            }
                        },
                        { $group: { _id: null, avgDuration: { $avg: "$duration" } } }
                    ],
                    tasksThisWeek: [
                        { $match: { createdAt: { $gte: startOfWeek } } },
                        { $count: "count" }
                    ],
                    totalTasks: [
                        { $count: "count" }
                    ],
                    completedTasks: [
                        { $match: { status: "completed" } },
                        { $count: "count" }
                    ]
                }
            }
        ]);

        return stats[0];
    }
}
import { Types } from "mongoose";

export default new TaskRepository();