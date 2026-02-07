import { ITask } from "../interfaces/entities/ITask";
import { ITaskRepository } from "../interfaces/repositoryInterfaces/ITaskRepository";
declare class TaskRepository implements ITaskRepository {
    constructor();
    create(task: Partial<ITask>): Promise<ITask>;
}
declare const _default: TaskRepository;
export default _default;
//# sourceMappingURL=taskRepository.d.ts.map