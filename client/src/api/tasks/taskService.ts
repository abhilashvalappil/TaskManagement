import { taskENDPOINTS } from "../../constants/endPointUrl";
import type { CreateTaskData } from "../../types/taskTypes";
import API from "../../utils/axiosInstance";

export const createTask = async (taskData: CreateTaskData) => {
    const formData = new FormData();

    formData.append('title', taskData.title);
    formData.append('description', taskData.description);
    formData.append('priority', taskData.priority);

    if (taskData.dueDate) {
        formData.append('dueDate', taskData.dueDate);
    }

    if (taskData.assignees) {
        formData.append('assignees', JSON.stringify(taskData.assignees));
    }
    if (taskData.attachments && taskData.attachments.length > 0) {
        taskData.attachments.forEach((uploadedFile: any) => {
            formData.append('attachments', uploadedFile.file);
        });
    }

    const response = await API.post(taskENDPOINTS.CREATE_TASK, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const updateTask = async (taskId: string, taskData: any) => {
    const formData = new FormData();
    formData.append('title', taskData.title);
    formData.append('description', taskData.description);
    formData.append('priority', taskData.priority);
    formData.append('status', taskData.status);

    if (taskData.dueDate) {
        formData.append('dueDate', taskData.dueDate);
    }

    if (taskData.assignees) {
        formData.append('assignees', JSON.stringify(taskData.assignees));
    }

    if (taskData.existingAttachments) {
        formData.append('existingAttachments', JSON.stringify(taskData.existingAttachments));
    }

    if (taskData.newAttachments && taskData.newAttachments.length > 0) {
        taskData.newAttachments.forEach((uploadedFile: any) => {
            formData.append('attachments', uploadedFile.file);
        });
    }

    const response = await API.put(`${taskENDPOINTS.UPDATE_TASK}/${taskId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const getTasks = async () => {
    const response = await API.get(taskENDPOINTS.GET_TASKS);
    return response.data;
};
