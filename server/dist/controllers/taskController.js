"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }
    async createTask(req, res, next) {
        try {
            const { title, description, priority, dueDate, assignees, attachments } = req.body;
            if (!title || !description || !priority || !dueDate) {
                res.status(400).json({ error: "Title, description, priority, and dueDate are required" });
                return;
            }
            const files = req.files;
            // Handle assignees and attachments which might be JSON strings or arrays in multipart/form-data
            let parsedAssignees = assignees;
            if (typeof assignees === 'string') {
                try {
                    parsedAssignees = JSON.parse(assignees);
                }
                catch (e) {
                    parsedAssignees = [assignees];
                }
            }
            let parsedAttachments = attachments;
            if (typeof attachments === 'string') {
                try {
                    parsedAttachments = JSON.parse(attachments);
                }
                catch (e) {
                    parsedAttachments = [attachments];
                }
            }
            const taskData = {
                title,
                description,
                priority,
                dueDate: new Date(dueDate),
                assignees: parsedAssignees,
                attachments: parsedAttachments,
                files
            };
            const result = await this.taskService.createTask(taskData);
            res.status(201).json({
                success: true,
                message: result.message,
                task: result.task,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.TaskController = TaskController;
//# sourceMappingURL=taskController.js.map