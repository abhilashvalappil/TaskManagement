import React from 'react';
import './LogoutConfirmationModal.css';

interface LogoutConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="logout-modal-overlay" onClick={onClose}>
            <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="logout-modal-icon-wrapper">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </div>
                <h2 className="logout-modal-title">Logout Confirmation</h2>
                <p className="logout-modal-message">Are you sure you want to log out of your account? You will need to sign in again to access your tasks.</p>
                <div className="logout-modal-actions">
                    <button className="logout-btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="logout-btn-confirm" onClick={onConfirm}>Logout</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmationModal;
