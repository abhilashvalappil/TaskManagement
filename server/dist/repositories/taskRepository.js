"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const taskModel_1 = __importDefault(require("../models/taskModel"));
class TaskRepository {
    constructor() {
    }
    async create(task) {
        const newTask = new taskModel_1.default(task);
        return await newTask.save();
    }
}
exports.default = new TaskRepository();
//# sourceMappingURL=taskRepository.js.map