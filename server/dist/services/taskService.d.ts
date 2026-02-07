import { ITaskRepository } from "../interfaces/repositoryInterfaces/ITaskRepository";
import { ITaskService } from "../interfaces/serviceInterfaces/ITaskService";
import { CreateTaskData, CreateTaskResult } from "../types/taskTypes";
export declare class TaskService implements ITaskService {
    private taskRepository;
    constructor(taskRepository: ITaskRepository);
    createTask(taskData: CreateTaskData): Promise<CreateTaskResult>;
}
//# sourceMappingURL=taskService.d.ts.map