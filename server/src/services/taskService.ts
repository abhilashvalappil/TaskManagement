import { uploadToCloudinary } from "../utils/cloudinary";
import { ITaskRepository } from "../interfaces/repositoryInterfaces/ITaskRepository";
import { ITaskService } from "../interfaces/serviceInterfaces/ITaskService";
import { CreateTaskData, CreateTaskResult, UpdateTaskData, UpdateTaskRequest } from "../types/taskTypes";
import { ITask } from "../interfaces/entities/ITask";


export class TaskService implements ITaskService {
    private taskRepository: ITaskRepository;

    constructor(taskRepository: ITaskRepository) {
        this.taskRepository = taskRepository;
    }

    async createTask(taskData: CreateTaskData): Promise<CreateTaskResult> {
        const uploadedUrls: string[] = [];
        if (taskData.files && taskData.files.length > 0) {
            const uploadPromises = taskData.files.map((file: any) => uploadToCloudinary(file.buffer));
            const results = await Promise.all(uploadPromises);
            uploadedUrls.push(...results);
        }

        const taskToCreate = {
            ...taskData,
            attachments: [...(taskData.attachments || []), ...uploadedUrls],
        };

        if ('files' in taskToCreate) {
            delete (taskToCreate as any).files;
        }

        const result = await this.taskRepository.create(taskToCreate);
        return {
            message: "Task created successfully",
            task: result,
        };
    }

    async getTasks(userId: string): Promise<{tasks: ITask[]}> {
        const tasks = await this.taskRepository.findByUserId(userId);
        return { tasks }
    }

    async updateTask(taskId: string, userId: string,updateData: UpdateTaskRequest,files: Express.Multer.File[]): Promise<ITask | null> {
        let uploadedUrls: string[] = [];
        if (files && files.length > 0) {
            const uploadPromises = files.map(file =>
                uploadToCloudinary(file.buffer)
            );
            uploadedUrls = await Promise.all(uploadPromises);
        }

        const finalAttachments = [
            ...(updateData.existingAttachments ?? []),
            ...uploadedUrls,
        ];

        const payload: UpdateTaskData = {
            ...(updateData.title !== undefined && { title: updateData.title }),
            ...(updateData.description !== undefined && { description: updateData.description }),
            ...(updateData.priority !== undefined && { priority: updateData.priority }),
            ...(updateData.status !== undefined && { status: updateData.status }),
            ...(updateData.dueDate !== undefined && { dueDate: new Date(updateData.dueDate) }),
            ...(updateData.assignees !== undefined && { assignees: updateData.assignees }),
            attachments: finalAttachments,
        };
        return await this.taskRepository.updateTask(taskId, userId,payload);
    }

    async deleteTask(taskId: string, userId: string): Promise<boolean> {
        return await this.taskRepository.deleteTask(taskId, userId);
    }

    async getAnalytics(userId: string): Promise<any> {
        return await this.taskRepository.getAnalytics(userId);
    }
}