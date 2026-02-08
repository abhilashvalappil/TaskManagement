
import express from 'express';
import { TaskController } from '../controllers/taskController';
import { TaskService } from '../services/taskService';
import taskRepository from '../repositories/taskRepository';
import upload from '../middlewares/uploadMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';

const taskRouter = express.Router();

const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

taskRouter.post('/',authMiddleware,upload.array('attachments', 10),taskController.createTask.bind(taskController))
taskRouter.get('/',authMiddleware,taskController.getTasks.bind(taskController))
taskRouter.put('/:id',authMiddleware,upload.array('attachments', 10),taskController.updateTask.bind(taskController))
taskRouter.delete('/:id',authMiddleware,taskController.deleteTask.bind(taskController))
export default taskRouter;
