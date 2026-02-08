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
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import EditTaskModal from "../components/EditTaskModal";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import "../styles/TaskDetails.css";

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
    attachments: string[];
    comments: Comment[];
    createdAt: string;
    updatedAt: string;
}

interface TaskDetailsProps {
    task?: Task;
    onBack?: () => void;
    onDelete?: (id: string) => void;
    onMarkComplete?: (id: string) => void;
    onUpdate?: (id: string, data: any) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
    task,
    onBack,
    onDelete,
    onMarkComplete,
    onUpdate
}) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // Merge provided task with defaults to ensure all fields exist
    const defaultTask: Task = {
        _id: "mock-1",
        title: "Task Details",
        description: "No description provided.",
        status: "pending",
        priority: "medium",
        dueDate: "Not set",
        assignees: ["Unassigned"],
        attachments: [],
        comments: [],
        createdAt: "Recently",
        updatedAt: "Just now"
    };

    const currentTask = task ? { ...defaultTask, ...task } : defaultTask;

    // Parse attachments from string array to Attachment objects
    const attachmentItems: Attachment[] = Array.isArray(currentTask.attachments)
        ? currentTask.attachments.map((url: string, index: number) => {
            const fileName = url.split('/').pop() || `Attachment ${index + 1}`;
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
            return {
                id: `attach-${index}`,
                name: fileName,
                url: url,
                previewUrl: isImage ? url : undefined
            };
        })
        : [];

    const handleViewAttachment = (url: string) => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    const handleDownloadAttachment = async (url: string, fileName: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed", error);
            // Fallback: just open in new tab
            window.open(url, "_blank");
        }
    };

    const formatDate = (date?: string) => {
        if (!date) return "Not set";

        const d = new Date(date);
        if (isNaN(d.getTime())) return "Invalid date";

        return d.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };


    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <div className="task-details-container">
                    <header className="task-details-header">
                        <div className="header-left">
                            <button className="back-btn" onClick={onBack}>
                                <ArrowLeft size={20} />
                            </button>
                            <h1>Task Details</h1>
                        </div>
                        <div className="header-right">
                            <button className="action-btn" onClick={() => setIsEditModalOpen(true)}>
                                <Edit2 size={18} />
                            </button>
                            <button className="action-btn delete-btn" onClick={() => setIsDeleteModalOpen(true)}>
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
                                    <span className="info-value">{formatDate(currentTask.updatedAt)}</span>
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
                                            {attach.previewUrl ? (
                                                <img src={attach.previewUrl} alt="" />
                                            ) : (
                                                <div className="file-icon-placeholder">
                                                    <Paperclip size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <span className="attachment-name">{attach.name}</span>
                                        <div className="attachment-actions">
                                            <button
                                                className="attach-action-btn"
                                                title="View"
                                                onClick={() => handleViewAttachment(attach.url)}
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className="attach-action-btn"
                                                title="Download"
                                                onClick={() => handleDownloadAttachment(attach.url, attach.name)}
                                            >
                                                <Download size={16} />
                                            </button>
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

                    <EditTaskModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        task={currentTask as any}
                        onSubmit={(id: string, data: any) => {
                            onUpdate?.(id, data);
                            setIsEditModalOpen(false);
                        }}
                    />

                    <DeleteConfirmationModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setIsDeleteModalOpen(false)}
                        onConfirm={() => {
                            onDelete?.(currentTask._id);
                            setIsDeleteModalOpen(false);
                        }}
                        taskTitle={currentTask.title}
                    />
                </div>
            </main>
        </div>
    );
};

export default TaskDetails;
