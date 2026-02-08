import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getAnalytics } from "../api/tasks/taskService";
import "./Analytics.css";

const Analytics: React.FC = () => {
    const [analyticsData, setAnalyticsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await getAnalytics();
                setAnalyticsData(data);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="dashboard-main">
                    <div className="loading-state">Loading analytics...</div>
                </main>
            </div>
        );
    }

    // Process Completion Rate
    const totalTasks = analyticsData?.totalTasks?.[0]?.count || 0;
    const completedTasks = analyticsData?.completedTasks?.[0]?.count || 0;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Process Tasks This Week
    const tasksThisWeek = analyticsData?.tasksThisWeek?.[0]?.count || 0;

    // Process Avg Completion Time
    const avgDurationMs = analyticsData?.avgCompletionTime?.[0]?.avgDuration || 0;
    const avgDays = Math.round(avgDurationMs / (1000 * 60 * 60 * 24));

    const stats = [
        {
            title: "Completion Rate",
            value: `${completionRate}%`,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
            ),
            iconBg: "#e0f2fe",
            iconColor: "#0ea5e9",
        },
        {
            title: "Tasks This Week",
            value: tasksThisWeek.toString(),
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="6"></circle>
                    <circle cx="12" cy="12" r="2"></circle>
                </svg>
            ),
            iconBg: "#f0fdf4",
            iconColor: "#22c55e",
        },
        {
            title: "Avg. Completion Time",
            value: `${avgDays}d`,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
            ),
            iconBg: "#f8fafc",
            iconColor: "#64748b",
        },
    ];

    // Process Priority Data
    const priorities = ["low", "medium", "high"];
    const priorityCounts = analyticsData?.byPriority?.reduce((acc: any, curr: any) => {
        acc[curr._id] = curr.count;
        return acc;
    }, {}) || {};

    const priorityData = priorities.map(p => ({
        label: p.charAt(0).toUpperCase() + p.slice(1),
        value: priorityCounts[p] || 0
    }));

    const maxPriorityValue = Math.max(...priorityData.map(d => d.value), 4);

    // Process Weekly Activity
    const activityData = days.map((_, index) => {
        const dayNum = index + 1; // MongoDB $dayOfWeek is 1 (Sun) to 7 (Sat)
        const dayCreated = analyticsData?.weeklyActivity?.find((item: any) => item._id.day === dayNum && item._id.status === "created")?.count || 0;
        const dayCompleted = analyticsData?.weeklyActivity?.find((item: any) => item._id.day === dayNum && item._id.status === "completed")?.count || 0;
        return { created: dayCreated, completed: dayCompleted };
    });

    const maxActivityValue = Math.max(...activityData.map(d => Math.max(d.created, d.completed)), 4);

    const generateLinePath = (dataKey: 'created' | 'completed') => {
        return activityData.map((d, i) => {
            const x = 50 + (i * 100);
            const y = 190 - (d[dataKey] / maxActivityValue) * 170;
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
    };

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <div className="analytics-header">
                    <h1 className="analytics-title">Analytics</h1>
                    <p className="analytics-subtitle">Track your productivity and task metrics</p>
                </div>

                <div className="analytics-stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="analytics-stat-card">
                            <div className="stat-icon-wrapper" style={{ backgroundColor: stat.iconBg, color: stat.iconColor }}>
                                {stat.icon}
                            </div>
                            <div className="stat-content">
                                <p className="stat-label">{stat.title}</p>
                                <h2 className="stat-number">{stat.value}</h2>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="analytics-charts-container">
                    <div className="chart-section tasks-by-status">
                        <h3 className="chart-title">Tasks by Status</h3>
                        {analyticsData?.byStatus && analyticsData.byStatus.length > 0 ? (
                            <div className="status-list">
                                {analyticsData.byStatus.map((s: any) => (
                                    <div key={s._id} className="status-item">
                                        <span className="status-bullet" data-status={s._id}></span>
                                        <span className="status-name">{s._id.charAt(0).toUpperCase() + s._id.slice(1)}</span>
                                        <span className="status-count">{s.count}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-chart-placeholder">
                                <p>No status data available</p>
                            </div>
                        )}
                    </div>

                    <div className="chart-section tasks-by-priority">
                        <h3 className="chart-title">Tasks by Priority</h3>
                        <div className="priority-chart">
                            <div className="y-axis">
                                {[maxPriorityValue, Math.round(maxPriorityValue * 0.75), Math.round(maxPriorityValue * 0.5), Math.round(maxPriorityValue * 0.25), 0].map(v => <span key={v}>{v}</span>)}
                            </div>
                            <div className="chart-area">
                                <div className="grid-lines">
                                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="grid-line"></div>)}
                                </div>
                                <div className="bars-container">
                                    {priorityData.map((data, i) => (
                                        <div key={i} className="bar-wrapper">
                                            <div className="bar" style={{ height: `${(data.value / maxPriorityValue) * 100 || 2}%` }}></div>
                                            <span className="bar-label">{data.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="chart-section weekly-activity">
                    <h3 className="chart-title">Weekly Activity</h3>
                    <div className="activity-chart">
                        <div className="y-axis">
                            {[maxActivityValue, Math.round(maxActivityValue * 0.75), Math.round(maxActivityValue * 0.5), Math.round(maxActivityValue * 0.25), 0].map(v => <span key={v}>{v}</span>)}
                        </div>
                        <div className="chart-area">
                            <div className="grid-lines">
                                {[1, 2, 3, 4, 5].map(i => <div key={i} className="grid-line"></div>)}
                            </div>

                            <svg className="line-chart-svg" viewBox="0 0 700 200" preserveAspectRatio="none">
                                {/* Created Line (Blue) */}
                                <path
                                    d={generateLinePath('created')}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2"
                                />
                                {/* Dots for Created */}
                                {activityData.map((d, i) => (
                                    <circle key={`created-${i}`} cx={50 + (i * 100)} cy={190 - (d.created / maxActivityValue) * 170} r="4" fill="white" stroke="#3b82f6" strokeWidth="2" />
                                ))}

                                {/* Completed Line (Green) */}
                                <path
                                    d={generateLinePath('completed')}
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="2"
                                    strokeDasharray="4 2"
                                />
                                {/* Dots for Completed */}
                                {activityData.map((d, i) => (
                                    <circle key={`completed-${i}`} cx={50 + (i * 100)} cy={190 - (d.completed / maxActivityValue) * 170} r="3" fill="#10b981" />
                                ))}
                            </svg>

                            <div className="x-axis">
                                {days.map(day => <span key={day}>{day}</span>)}
                            </div>
                        </div>
                    </div>
                    <div className="chart-legend">
                        <div className="legend-item">
                            <span className="legend-dots completed"></span>
                            <span>Completed</span>
                        </div>
                        <div className="legend-item">
                            <span className="legend-dots created"></span>
                            <span>Created</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
