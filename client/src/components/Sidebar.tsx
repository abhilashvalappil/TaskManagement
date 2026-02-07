import React from "react";

const Sidebar: React.FC = () => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2 className="sidebar-logo">TaskManager</h2>
            </div>

            <nav className="sidebar-nav">
                <ul className="nav-list">
                    <li className="nav-item active">
                        <a href="/dashboard" className="nav-link">
                            <span className="nav-icon">📊</span>
                            <span className="nav-text">Dashboard</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/tasks" className="nav-link">
                            <span className="nav-icon">✓</span>
                            <span className="nav-text">Tasks</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/calendar" className="nav-link">
                            <span className="nav-icon">📅</span>
                            <span className="nav-text">Calendar</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/projects" className="nav-link">
                            <span className="nav-icon">📁</span>
                            <span className="nav-text">Projects</span>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="/settings" className="nav-link">
                            <span className="nav-icon">⚙️</span>
                            <span className="nav-text">Settings</span>
                        </a>
                    </li>
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="user-avatar">JD</div>
                    <div className="user-info">
                        <p className="user-name">John Doe</p>
                        <p className="user-email">john@example.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
