"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taskController_1 = require("../controllers/taskController");
const taskService_1 = require("../services/taskService");
const taskRepository_1 = __importDefault(require("../repositories/taskRepository"));
const uploadMiddleware_1 = __importDefault(require("../middlewares/uploadMiddleware"));
const taskRouter = express_1.default.Router();
const taskService = new taskService_1.TaskService(taskRepository_1.default);
const taskController = new taskController_1.TaskController(taskService);
taskRouter.post('/', uploadMiddleware_1.default.array('attachments', 10), // Use 'attachments' to match DB field concept
taskController.createTask.bind(taskController));
exports.default = taskRouter;
//# sourceMappingURL=taskRouter.js.map