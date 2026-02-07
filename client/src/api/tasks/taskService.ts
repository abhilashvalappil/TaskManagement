import { taskENDPOINTS } from "../../constants/endPointUrl";
import type { CreateTaskData } from "../../types/taskTypes";
import API from "../../utils/axiosInstance";


// export const createTask = async (taskData: CreateTaskData) => {
//     console.log("Task Data: ", taskData);
//     const response = await API.post(taskENDPOINTS.CREATE_TASK, taskData);
//     return response.data;
// };

export const createTask = async (taskData: CreateTaskData) => {
    console.log("Task Data: ", taskData);
    
    // Create FormData for file uploads
    const formData = new FormData();
    
    // Append basic fields
    formData.append('title', taskData.title);
    formData.append('description', taskData.description);
    formData.append('priority', taskData.priority);

     if (taskData.dueDate) {
        formData.append('dueDate', taskData.dueDate);
    }
    
    // Handle assignees - convert single email to array
    if (taskData.assignees) {
        formData.append('assignees', JSON.stringify(taskData.assignees));
    }
    
    // Append actual file objects from the files array
    if (taskData.attachments && taskData.attachments.length > 0) {
        taskData.attachments.forEach((uploadedFile: any) => {
            // uploadedFile.file is the actual File object
            formData.append('attachments', uploadedFile.file);
        });
    }
    
    // Log what we're sending
    console.log('📤 Sending FormData:');
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    
    const response = await API.post(taskENDPOINTS.CREATE_TASK, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    
    return response.data;
};

export const getTasks = async () => {
    const response = await API.get(taskENDPOINTS.GET_TASKS);
    console.log("Tasks##@@@@===>>>>>>>: ", response.data);
    return response.data;
};
