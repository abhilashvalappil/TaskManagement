
import { Request, Response, NextFunction } from "express";
import { ITaskService } from "../interfaces/serviceInterfaces/ITaskService";
import { CreateTaskData } from "../types/taskTypes";
import { AuthRequest } from "../types";
import { Types } from "mongoose";

export class TaskController {
    private taskService: ITaskService;

    constructor(taskService: ITaskService) {
        this.taskService = taskService;
    }

    async createTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log(req.body);
            const { title, description, priority, dueDate, assignees, attachments } = req.body;
            if (!title || !description || !priority || !dueDate) {
                res.status(400).json({ error: "Title, description, priority, and dueDate are required" })
                return;
            }
            if (!req.user?.userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const userId = req.user.userId;
            const files = req.files as Express.Multer.File[];

            let parsedAssignees = assignees;
            if (typeof assignees === 'string') {
                try {
                    parsedAssignees = JSON.parse(assignees);
                } catch (e) {
                    parsedAssignees = [assignees];
                }
            }

            let parsedAttachments = attachments;
            if (typeof attachments === 'string') {
                try {
                    parsedAttachments = JSON.parse(attachments);
                } catch (e) {
                    parsedAttachments = [attachments];
                }
            }

            const taskData: CreateTaskData = {
                title,
                description,
                priority,
                dueDate: new Date(dueDate),
                assignees: parsedAssignees,
                attachments: parsedAttachments,
                files,
                userId: new Types.ObjectId(req.user.userId),
            };
            const result = await this.taskService.createTask(taskData);
            res.status(201).json({
                success: true,
                message: result.message,
                task: result.task,
            })
        } catch (error) {
            next(error);
        }
    }

    async getTasks(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const userId = req.user.userId;
            const result = await this.taskService.getTasks(userId);
            res.status(200).json(result.tasks)
        } catch (error) {
            next(error);
        }
    }

    async updateTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const rawTaskId = req.params.id;
            if (!rawTaskId || Array.isArray(rawTaskId)) {
                res.status(400).json({ error: "Invalid Task ID" });
                return;
            }

            const taskId: string = rawTaskId;

            const userId = req.user.userId;

            const updateData = {
                ...req.body,
                assignees: req.body.assignees
                    ? JSON.parse(req.body.assignees)
                    : [],
                existingAttachments: req.body.existingAttachments
                    ? JSON.parse(req.body.existingAttachments)
                    : [],
            };

            const files = req.files as Express.Multer.File[];
        const task = await this.taskService.updateTask(taskId,userId,updateData,files);
            res.status(200).json(task)
        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const rawTaskId = req.params.id;
            if (!rawTaskId || Array.isArray(rawTaskId)) {
                res.status(400).json({ error: "Invalid Task ID" });
                return;
            }

            const taskId: string = rawTaskId;
            const userId = req.user.userId;

            const success = await this.taskService.deleteTask(taskId, userId);
            if (success) {
                res.status(200).json({ success: true, message: "Task deleted successfully" });
            } else {
                res.status(404).json({ error: "Task not found" });
            }
        } catch (error) {
            next(error);
        }
    }
}