import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import { logout } from "../api/auth/authService";
import { clearUser } from "../redux/slices/authSlice";

const Sidebar: React.FC = () => {
    const location = useLocation();
    const user = useSelector((state: any) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const initials = user?.fullName
        ? user.fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase()
        : "AV";

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleLogoutConfirm = async () => {
        try {
            await logout();
            dispatch(clearUser());
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLogoutModalOpen(false);
        }
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-logo">Taskify</h2>
                <p className="sidebar-tagline">your task manager</p>
            </div>

            <nav className="sidebar-nav">
                <ul className="nav-list">
                    <li className={`nav-item ${isActive("/dashboard") ? "active" : ""}`}>
                        <Link to="/dashboard" className="nav-link">
                            <span className="nav-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                </svg>
                            </span>
                            <span className="nav-text">Dashboard</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive("/tasks") ? "active" : ""}`}>
                        <Link to="/tasks" className="nav-link">
                            <span className="nav-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="8" y1="6" x2="21" y2="6"></line>
                                    <line x1="8" y1="12" x2="21" y2="12"></line>
                                    <line x1="8" y1="18" x2="21" y2="18"></line>
                                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                                </svg>
                            </span>
                            <span className="nav-text">Tasks</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive("/analytics") ? "active" : ""}`}>
                        <Link to="/analytics" className="nav-link">
                            <span className="nav-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="20" x2="18" y2="10"></line>
                                    <line x1="12" y1="20" x2="12" y2="4"></line>
                                    <line x1="6" y1="20" x2="6" y2="14"></line>
                                </svg>
                            </span>
                            <span className="nav-text">Analytics</span>
                        </Link>
                    </li>
                    <li className={`nav-item ${isActive("/profile") ? "active" : ""}`}>
                        <Link to="/profile" className="nav-link">
                            <span className="nav-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </span>
                            <span className="nav-text">Profile</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">{initials}</div>
                    <div className="user-info">
                        <p className="user-name">{user?.fullName || "Abhilash Valappil"}</p>
                        <p className="user-email">{user?.email || "abhilashvalappil321@gmail.com"}</p>
                    </div>
                </div>
                <div className="logout-wrapper">
                    <button className="logout-btn" onClick={handleLogoutClick}>
                        <span className="nav-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                <polyline points="16 17 21 12 16 7"></polyline>
                                <line x1="21" y1="12" x2="9" y2="12"></line>
                            </svg>
                        </span>
                        Logout
                    </button>
                </div>
            </div>

            <LogoutConfirmationModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
            />
        </aside>
    );
};

export default Sidebar;
