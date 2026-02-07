import { ITask } from "../entities/ITask";
export interface ITaskRepository {
    create(task: Partial<ITask>): Promise<ITask>;
}
//# sourceMappingURL=ITaskRepository.d.ts.map