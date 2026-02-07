import { uploadToCloudinary } from "../utils/cloudinary";
import { ITaskRepository } from "../interfaces/repositoryInterfaces/ITaskRepository";
import { ITaskService } from "../interfaces/serviceInterfaces/ITaskService";
import { CreateTaskData, CreateTaskResult } from "../types/taskTypes";
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

        // Remove 'files' property as it is not part of the ITask interface and shouldn't be passed to repository
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
}