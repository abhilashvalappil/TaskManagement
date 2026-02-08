import React, { useState, useEffect } from "react";
import { X, Upload, Trash2, Paperclip, ClipboardList } from "lucide-react";
import "../styles/EditTaskModal.css";

interface UploadedFile {
    id: string;
    file: File;
    preview?: string;
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
}

interface EditTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (taskId: string, taskData: any) => void;
    task: Task;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    task,
}) => {
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [priority, setPriority] = useState(task?.priority || "medium");
    const [status, setStatus] = useState(task?.status || "pending");
    const [dueDate, setDueDate] = useState("");
    const [assignedTo, setAssignedTo] = useState(task?.assignees?.[0] || "");
    const [existingAttachments, setExistingAttachments] = useState<string[]>(task?.attachments || []);
    const [newAttachments, setNewAttachments] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const toInputDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};


    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setPriority(task.priority);
            setStatus(task.status);
            setAssignedTo(task.assignees?.[0] || "");
            setExistingAttachments(task.attachments || []);

            if (task.dueDate && task.dueDate !== "Not set") {
                try {
                    const date = new Date(task.dueDate);
                    if (!isNaN(date.getTime())) {
                        setDueDate(toInputDate(task.dueDate));
                    }
                } catch (e) {
                    setDueDate("");
                }
            }
        }
    }, [task, isOpen]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = (files: File[]) => {
        const totalFiles = existingAttachments.length + newAttachments.length;
        const remaining = 5 - totalFiles;

        const newFiles: UploadedFile[] = files.slice(0, remaining).map((file) => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        }));
        setNewAttachments([...newAttachments, ...newFiles]);
    };

    const removeExistingAttachment = (index: number) => {
        const updated = [...existingAttachments];
        updated.splice(index, 1);
        setExistingAttachments(updated);
    };

    const removeNewAttachment = (id: string) => {
        setNewAttachments(newAttachments.filter((f) => f.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(task._id, {
            title,
            description,
            priority,
            status,
            dueDate,
            assignees: assignedTo ? [assignedTo] : [],
            existingAttachments,
            newAttachments,
        });
        onClose();
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Edit Task</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label className="form-label">Task Title</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Enter task description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Priority</label>
                            <select
                                className="form-select"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as any)}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Due Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Assigned To</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter email address"
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Attachments ({existingAttachments.length + newAttachments.length}/5)
                        </label>

                        {/* Existing Attachments */}
                        {existingAttachments.length > 0 && (
                            <div className="attachments-list existing">
                                {existingAttachments.map((url, index) => (
                                    <div key={`existing-${index}`} className="uploaded-file-item">
                                        <div className="file-preview">
                                            {/\.(jpg|jpeg|png|gif|webp)$/i.test(url) ? (
                                                <img src={url} alt="preview" />
                                            ) : (
                                                <Paperclip size={20} />
                                            )}
                                        </div>
                                        <div className="file-info">
                                            <p className="file-name">{url.split('/').pop()}</p>
                                            <p className="file-size">Existing File</p>
                                        </div>
                                        <div className="file-actions">
                                            <button
                                                type="button"
                                                className="file-action-btn remove-btn"
                                                onClick={() => removeExistingAttachment(index)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New Attachments Upload Area */}
                        {(existingAttachments.length + newAttachments.length) < 5 && (
                            <div
                                className={`file-upload-area ${isDragging ? "dragging" : ""}`}
                                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setIsDragging(false);
                                    if (e.dataTransfer.files) handleFiles(Array.from(e.dataTransfer.files));
                                }}
                                onClick={() => document.getElementById("edit-file-input")?.click()}
                                style={{ marginTop: existingAttachments.length > 0 ? '12px' : '0' }}
                            >
                                <Upload size={32} className="upload-icon" />
                                <p className="upload-text">Click or drag to add more files</p>
                                <input
                                    id="edit-file-input"
                                    type="file"
                                    multiple
                                    accept="image/*,.pdf,.doc,.docx"
                                    onChange={handleFileSelect}
                                    style={{ display: "none" }}
                                />
                            </div>
                        )}

                        {/* New Attachments List */}
                        {newAttachments.length > 0 && (
                            <div className="attachments-list new">
                                {newAttachments.map((file) => (
                                    <div key={file.id} className="uploaded-file-item">
                                        <div className="file-preview">
                                            {file.preview ? (
                                                <img src={file.preview} alt="preview" />
                                            ) : (
                                                <Paperclip size={20} />
                                            )}
                                        </div>
                                        <div className="file-info">
                                            <p className="file-name">{file.file.name}</p>
                                            <p className="file-size">{formatFileSize(file.file.size)}</p>
                                        </div>
                                        <div className="file-actions">
                                            <button
                                                type="button"
                                                className="file-action-btn remove-btn"
                                                onClick={() => removeNewAttachment(file.id)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn-update-task">
                            <ClipboardList size={20} style={{ marginRight: '8px' }} />
                            Save Changes
                        </button>
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTaskModal;
