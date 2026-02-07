
export interface CreateTaskData {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    dueDate?: string;
    assignees?: string[];
    // attachments?: string[];
    attachments?: Array<{id: string; file: File; preview?: string}>;
}