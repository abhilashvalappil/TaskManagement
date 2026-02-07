import React from "react";
import {
    ArrowLeft,
    Edit2,
    Trash2,
    CheckCircle,
    Calendar,
    User,
    Clock,
    Paperclip,
    Eye,
    Download,
    MessageSquare
} from "lucide-react";
import "./TaskDetails.css";

interface Attachment {
    id: string;
    name: string;
    url: string;
    previewUrl?: string;
}

interface Comment {
    id: string;
    text: string;
    author: string;
    date: string;
}

interface Task {
    _id: string;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed";
    priority: "low" | "medium" | "high";
    dueDate: string;
    assignees: string[];
    attachments: Attachment[];
    comments: Comment[];
    createdAt: string;
    updatedAt: string;
}

interface TaskDetailsProps {
    task?: Task;
    onBack?: () => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onMarkComplete?: (id: string) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
    task,
    onBack,
    onEdit,
    onDelete,
    onMarkComplete
}) => {
    // Merge provided task with defaults to ensure all fields exist
    const defaultTask: Task = {
        _id: "mock-1",
        title: "Task Details",
        description: "No description provided.",
        status: "pending",
        priority: "medium",
        dueDate: "Not set",
        assignees: ["Unassigned"],
        attachments: [
            { id: "1", name: "Screenshot 1.png", url: "#" },
            { id: "2", name: "Screenshot 2.png", url: "#" }
        ],
        comments: [],
        createdAt: "Recently",
        updatedAt: "Just now"
    };

    const currentTask = task ? { ...defaultTask, ...task } : defaultTask;

    // Handle attachments if they are passed as count from Tasks.tsx
    const attachmentItems: Attachment[] = Array.isArray(currentTask.attachments)
        ? currentTask.attachments
        : Array.from({ length: typeof currentTask.attachments === 'number' ? currentTask.attachments : 0 }, (_, i) => ({
            id: `attach-${i}`,
            name: `Attachment ${i + 1}`,
            url: "#",
            previewUrl: ""
        }));

    return (
        <div className="task-details-container">
            <header className="task-details-header">
                <div className="header-left">
                    <button className="back-btn" onClick={onBack}>
                        <ArrowLeft size={20} />
                    </button>
                    <h1>Task Details</h1>
                </div>
                <div className="header-right">
                    <button className="action-btn" onClick={() => onEdit?.(currentTask._id)}>
                        <Edit2 size={18} />
                    </button>
                    <button className="action-btn delete-btn" onClick={() => onDelete?.(currentTask._id)}>
                        <Trash2 size={18} />
                    </button>
                </div>
            </header>

            <div className="task-details-card">
                <div className="task-main-info">
                    <h2>{currentTask.title}</h2>
                    <button
                        className="mark-complete-btn"
                        onClick={() => onMarkComplete?.(currentTask._id)}
                    >
                        <CheckCircle size={18} />
                        Mark Complete
                    </button>
                </div>

                <div className="task-badges-row">
                    <span className="status-badge">
                        {currentTask.status.charAt(0).toUpperCase() + currentTask.status.slice(1)}
                    </span>
                    <span className="priority-badge">
                        {currentTask.priority.charAt(0).toUpperCase() + currentTask.priority.slice(1)} Priority
                    </span>
                </div>

                <h3 className="section-label">Description</h3>
                <p className="description-text">{currentTask.description}</p>

                <div className="info-grid">
                    <div className="info-item">
                        <div className="icon-box blue">
                            <Calendar size={24} />
                        </div>
                        <div className="info-content">
                            <span className="info-label">Due Date</span>
                            <span className="info-value">{currentTask.dueDate}</span>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="icon-box green">
                            <User size={24} />
                        </div>
                        <div className="info-content">
                            <span className="info-label">Assigned To</span>
                            <span className="info-value">{currentTask.assignees.join(", ")}</span>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="icon-box gray">
                            <Clock size={24} />
                        </div>
                        <div className="info-content">
                            <span className="info-label">Last Updated</span>
                            <span className="info-value">{currentTask.updatedAt}</span>
                        </div>
                    </div>
                </div>

                <section className="attachments-section">
                    <div className="section-header-with-icon">
                        <Paperclip size={20} />
                        <h3 className="section-label" style={{ margin: 0 }}>Attachments</h3>
                        <span className="count">({attachmentItems.length})</span>
                    </div>

                    <div className="attachments-grid">
                        {attachmentItems.map((attach) => (
                            <div key={attach.id} className="attachment-card">
                                <div className="attachment-preview">
                                    {attach.previewUrl ? <img src={attach.previewUrl} alt="" /> : null}
                                </div>
                                <span className="attachment-name">{attach.name}</span>
                                <div className="attachment-actions">
                                    <button className="attach-action-btn"><Eye size={16} /></button>
                                    <button className="attach-action-btn"><Download size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="comments-section">
                    <div className="section-header-with-icon">
                        <MessageSquare size={20} />
                        <h3 className="section-label" style={{ margin: 0 }}>Comments</h3>
                        <span className="count">({currentTask.comments.length})</span>
                    </div>

                    {currentTask.comments.length === 0 ? (
                        <p className="empty-placeholder">No comments</p>
                    ) : (
                        <div className="comments-list">
                            {/* Comments would go here */}
                        </div>
                    )}
                </section>

                <div className="footer-date">
                    Created on {currentTask.createdAt}
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
