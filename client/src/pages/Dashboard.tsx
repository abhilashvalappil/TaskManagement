import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { getAnalytics, getTasks } from "../api/tasks/taskService";

interface StatCardProps {
    title: string;
    value: number | string;
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
    _id: string;
    title: string;
    status: "pending" | "in-progress" | "completed";
    priority: "low" | "medium" | "high";
    dueDate: string;
}

const Dashboard: React.FC = () => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [recentTasks, setRecentTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Load User
                const userRes = await API.get("/auth/me");
                dispatch(setUser(userRes.data.user));

                // Load Analytics & Tasks
                const [analyticsData, tasksData] = await Promise.all([
                    getAnalytics(),
                    getTasks()
                ]);

                setAnalytics(analyticsData);
                setRecentTasks(tasksData.slice(0, 5)); // Show latest 5 tasks
            } catch (error) {
                console.error("Dashboard data fetch failed:", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch, navigate]);

    const getStats = () => {
        if (!analytics) return { total: 0, completed: 0, inProgress: 0, pending: 0 };

        const total = analytics.totalTasks?.[0]?.count || 0;
        const completed = analytics.completedTasks?.[0]?.count || 0;
        const inProgress = analytics.byStatus?.find((s: any) => s._id === "in-progress")?.count || 0;
        const pending = analytics.byStatus?.find((s: any) => s._id === "pending")?.count || 0;

        return { total, completed, inProgress, pending };
    };

    const stats = getStats();
    const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

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

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="dashboard-main">
                    <div className="loading-state">Loading dashboard...</div>
                </main>
            </div>
        );
    }

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
                                    style={{ width: `${completionRate}%` }}
                                ></div>
                            </div>
                            <p className="progress-percentage">{completionRate}%</p>

                            <div className="progress-details">
                                <ProgressItem label="Completed Tasks" value={`${stats.completed} / ${stats.total}`} />
                                <ProgressItem label="In Progress" value={`${stats.inProgress} / ${stats.total}`} />
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
                            {recentTasks.length === 0 ? (
                                <p className="empty-placeholder">No recent tasks</p>
                            ) : (
                                recentTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        className="task-card"
                                        onClick={handleNavigateToTasks}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="task-header">
                                            <h3 className="task-title">{task.title}</h3>
                                            <div className="task-badges">
                                                <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                                                    {task.status.replace("-", " ")}
                                                </span>
                                                <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="task-due-date">Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
