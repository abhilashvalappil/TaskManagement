import React from "react";
import { AlertTriangle, X } from "lucide-react";
import "../styles/DeleteConfirmationModal.css";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    taskTitle: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    taskTitle,
}) => {
    if (!isOpen) return null;

    return (
        <div className="delete-modal-overlay" onClick={onClose}>
            <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="delete-modal-close" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="delete-modal-icon">
                    <AlertTriangle size={48} color="#ef4444" />
                </div>

                <h3 className="delete-modal-title">Delete Task?</h3>
                <p className="delete-modal-message">
                    Are you sure you want to delete <strong>"{taskTitle}"</strong>? This action cannot be undone.
                </p>

                <div className="delete-modal-actions">
                    <button className="delete-btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="delete-btn-danger" onClick={onConfirm}>
                        Delete Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
