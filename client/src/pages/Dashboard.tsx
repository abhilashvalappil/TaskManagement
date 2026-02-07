import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import API from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";

interface StatCardProps {
    title: string;
    value: number;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
    return (
        <div className="stat-card" style={{ borderLeftColor: color }}>
            <h3 className="stat-title">{title}</h3>
            <p className="stat-value">{value}</p>
        </div>
    );
};

interface ProgressItemProps {
    label: string;
    value: string;
}

const ProgressItem: React.FC<ProgressItemProps> = ({ label, value }) => {
    return (
        <div className="progress-item">
            <span className="progress-label">{label}</span>
            <span className="progress-value">{value}</span>
        </div>
    );
};

interface Task {
    id: number;
    title: string;
    status: "pending" | "in-progress" | "completed";
    priority: "low" | "medium" | "high";
    dueDate: string;
}

const Dashboard: React.FC = () => {
    // Mock data
    const stats = {
        total: 1,
        completed: 0,
        inProgress: 0,
        pending: 1,
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

useEffect(() => {
  const loadUser = async () => {
    try {
      const res = await API.get("/auth/me");  
      dispatch(setUser(res.data.user));
    } catch {
      navigate("/login");
    }
  };

  loadUser();
}, [dispatch, navigate]);


    const recentTasks: Task[] = [
        {
            id: 1,
            title: "Complete project documentation",
            status: "pending",
            priority: "high",
            dueDate: "2026-02-10",
        },
    ];

    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case "completed":
                return "badge-completed";
            case "in-progress":
                return "badge-in-progress";
            case "pending":
                return "badge-pending";
            default:
                return "";
        }
    };

    const getPriorityBadgeClass = (priority: string) => {
        switch (priority) {
            case "high":
                return "badge-high";
            case "medium":
                return "badge-medium";
            case "low":
                return "badge-low";
            default:
                return "";
        }
    };

    const handleNavigateToTasks = () => {
        navigate("/tasks");
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Dashboard</h1>
                        <p className="dashboard-subtitle">
                            Welcome back! Here's your task overview.
                        </p>
                    </div>
                </div>

                <div className="stats-grid">
                    <StatCard title="Total Tasks" value={stats.total} color="#4f46e5" />
                    <StatCard title="Completed" value={stats.completed} color="#10b981" />
                    <StatCard
                        title="In Progress"
                        value={stats.inProgress}
                        color="#f59e0b"
                    />
                    <StatCard title="Pending" value={stats.pending} color="#ef4444" />
                </div>

                <div className="dashboard-content">
                    <div className="progress-section">
                        <h2 className="section-title">Task Completion Progress</h2>
                        <div className="progress-card">
                            <h3 className="progress-card-title">Overall Progress</h3>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: "0%" }}
                                ></div>
                            </div>
                            <p className="progress-percentage">0%</p>

                            <div className="progress-details">
                                <ProgressItem label="Completed Tasks" value="0 / 1" />
                                <ProgressItem label="In Progress" value="0 / 1" />
                            </div>
                        </div>
                    </div>

                    <div className="tasks-section">
                        <div className="section-header">
                            <h2 className="section-title">Recent Tasks</h2>
                            <a
                                href="#"
                                className="view-all-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavigateToTasks();
                                }}
                            >
                                View All
                            </a>
                        </div>

                        <div className="tasks-list">
                            {recentTasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="task-card"
                                    onClick={handleNavigateToTasks}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="task-header">
                                        <h3 className="task-title">{task.title}</h3>
                                        <div className="task-badges">
                                            <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                                                {task.status}
                                            </span>
                                            <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                                                {task.priority}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="task-due-date">Due: {task.dueDate}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
