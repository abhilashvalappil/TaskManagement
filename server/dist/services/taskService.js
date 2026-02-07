"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const cloudinary_1 = require("../utils/cloudinary");
class TaskService {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }
    async createTask(taskData) {
        const uploadedUrls = [];
        if (taskData.files && taskData.files.length > 0) {
            const uploadPromises = taskData.files.map((file) => (0, cloudinary_1.uploadToCloudinary)(file.buffer));
            const results = await Promise.all(uploadPromises);
            uploadedUrls.push(...results);
        }
        const taskToCreate = {
            ...taskData,
            attachments: [...(taskData.attachments || []), ...uploadedUrls],
        };
        // Remove 'files' property as it is not part of the ITask interface and shouldn't be passed to repository
        if ('files' in taskToCreate) {
            delete taskToCreate.files;
        }
        const result = await this.taskRepository.create(taskToCreate);
        return {
            message: "Task created successfully",
            task: result,
        };
    }
}
exports.TaskService = TaskService;
//# sourceMappingURL=taskService.js.map