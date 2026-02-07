import { Request, Response, NextFunction } from "express";
import { ITaskService } from "../interfaces/serviceInterfaces/ITaskService";
export declare class TaskController {
    private taskService;
    constructor(taskService: ITaskService);
    createTask(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=taskController.d.ts.map