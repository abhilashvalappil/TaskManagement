import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CreateTaskModal from "../components/CreateTaskModal";
import { getTasks, createTask } from "../api/tasks/taskService";
import TaskDetails from "./TaskDetails";

interface Task {
    _id: string;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed";
    priority: "low" | "medium" | "high";
    createdDate: string;
    dueDate: string;
    attachments: number;
}

const Tasks: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");

    // State for tasks
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Fetch tasks on mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const data = await getTasks();

            const formattedTasks = data.map((task: any) => ({
                ...task,
                createdDate: task.createdAt ? new Date(task.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }) : "N/A",
                dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                }) : "N/A",
            }));
            setTasks(formattedTasks);
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTask = async (taskData: any) => {
        try {
            await createTask(taskData);
            // Refresh tasks after creation
            fetchTasks();
        } catch (error) {
            console.error("Failed to create task", error);
        }
    };

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

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || task.status === statusFilter;
        const matchesPriority =
            priorityFilter === "all" || task.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <div className="tasks-page-header">
                    <div>
                        <h1 className="page-title">Tasks</h1>
                        <p className="page-subtitle">Manage and track all your tasks</p>
                    </div>
                    <button className="btn-new-task" onClick={() => setIsModalOpen(true)}>
                        + New Task
                    </button>
                </div>

                <div className="tasks-filters-section">
                    <div className="search-box">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filters-group">
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <select
                            className="filter-select"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="all">All Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                </div>

                <div className="tasks-count">
                    <span className="filter-icon">⚡</span>
                    Showing {filteredTasks.length} to 1 of {tasks.length} tasks
                </div>

                <div className="tasks-grid">
                    {isLoading ? (
                        <p>Loading tasks...</p>
                    ) : filteredTasks.length === 0 ? (
                        <p>No tasks found.</p>
                    ) : (
                        filteredTasks.map((task) => (
                            <div
                                key={task._id}
                                className="task-item-card"
                                onClick={() => setSelectedTask(task)}
                            >
                                <div className="task-item-header">
                                    <h3 className="task-item-title">{task.title}</h3>
                                    <div className="task-item-badges">
                                        <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                        </span>
                                        <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                                            {task.status.charAt(0).toUpperCase() +
                                                task.status.slice(1).replace("-", " ")}
                                        </span>
                                    </div>
                                </div>

                                <p className="task-item-description">{task.description}</p>

                                <div className="task-item-footer">
                                    <div className="task-item-dates">
                                        <span className="task-date">
                                            🕐 Created: {task.createdDate}
                                        </span>
                                        <span className="task-date">📅 Due: {task.dueDate}</span>
                                    </div>
                                    {task.attachments > 0 && (
                                        <div className="task-attachments">
                                            <span className="attachment-icon">📎</span>
                                            {task.attachments}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <CreateTaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateTask}
                />
            </main>

            {selectedTask && (
                <div className="task-details-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#fff',
                    zIndex: 1001,
                    overflowY: 'auto'
                }}>
                    <TaskDetails
                        task={selectedTask as any}
                        onBack={() => setSelectedTask(null)}
                        onDelete={() => {
                            // Implement delete logic here if needed
                            setSelectedTask(null);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Tasks;
