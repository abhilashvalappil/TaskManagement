import React, { useState } from "react";

interface CreateTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (task: any) => void;
}

interface UploadedFile {
    id: string;
    file: File;
    preview?: string;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = (files: File[]) => {
        const newFiles: UploadedFile[] = files.slice(0, 5 - uploadedFiles.length).map((file) => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
        }));
        setUploadedFiles([...uploadedFiles, ...newFiles]);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const removeFile = (id: string) => {
        setUploadedFiles(uploadedFiles.filter((f) => f.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            description,
            priority,
            dueDate,
            assignees: assignedTo ? [assignedTo] : [],
            attachments: uploadedFiles, 
        });
        // Reset form
        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");
        setAssignedTo("");
        setUploadedFiles([]);
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
                    <h2 className="modal-title">Create New Task</h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
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

                    <div className="form-group">
                        <label className="form-label">Priority</label>
                        <select
                            className="form-select"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
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
                            <div className="assigned-input-group">
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="Enter email address"
                                    value={assignedTo}
                                    onChange={(e) => setAssignedTo(e.target.value)}
                                />
                                <button type="button" className="add-btn">
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Attach Files (Max 5 files, 10MB each)
                        </label>
                        <div
                            className={`file-upload-area ${isDragging ? "dragging" : ""}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById("file-input")?.click()}
                        >
                            <div className="upload-icon">↑</div>
                            <p className="upload-text">Click to upload or drag and drop</p>
                            <p className="upload-subtext">
                                Images, PDFs, Word documents (Max 10MB each)
                            </p>
                            <input
                                id="file-input"
                                type="file"
                                multiple
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={handleFileSelect}
                                style={{ display: "none" }}
                            />
                        </div>

                        {uploadedFiles.length > 0 && (
                            <div className="uploaded-files-list">
                                {uploadedFiles.map((uploadedFile) => (
                                    <div key={uploadedFile.id} className="uploaded-file-item">
                                        <div className="file-preview">
                                            {uploadedFile.preview ? (
                                                <img src={uploadedFile.preview} alt="preview" />
                                            ) : (
                                                <div className="file-icon">📄</div>
                                            )}
                                        </div>
                                        <div className="file-info">
                                            <p className="file-name">{uploadedFile.file.name}</p>
                                            <p className="file-size">
                                                {formatFileSize(uploadedFile.file.size)}
                                            </p>
                                        </div>
                                        <div className="file-actions">
                                            <button
                                                type="button"
                                                className="file-action-btn view-btn"
                                                onClick={() => {
                                                    if (uploadedFile.preview) {
                                                        window.open(uploadedFile.preview, "_blank");
                                                    }
                                                }}
                                            >
                                                👁
                                            </button>
                                            <button
                                                type="button"
                                                className="file-action-btn remove-btn"
                                                onClick={() => removeFile(uploadedFile.id)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="modal-actions">
                        <button type="submit" className="btn-create-task">
                            📋 Create Task
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

export default CreateTaskModal;
