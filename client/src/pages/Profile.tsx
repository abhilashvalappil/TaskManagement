import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import API from "../utils/axiosInstance";
import { updateProfile } from "../api/auth/authService";
import { useNavigate } from "react-router-dom";
import "../styles/Profile.css";

const Profile: React.FC = () => {
    const user = useSelector((state: any) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(!user);
    const [formData, setFormData] = useState({
        fullName: ""
    });

    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await API.get("/auth/me");
                dispatch(setUser(res.data.user));
            } catch {
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        if (!user) {
            loadUser();
        } else {
            setFormData({
                fullName: user.fullName || ""
            });
        }
    }, [user, dispatch, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const response = await updateProfile(formData.fullName);
            if (response.success) {
                dispatch(setUser(response.user));
                setIsEditing(false);
            }
        } catch (error) {
            console.error("Failed to update profile:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-layout">
                <Sidebar />
                <main className="dashboard-main">
                    <div className="loading-state">Loading profile...</div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="dashboard-main">
                <div className="profile-container">
                    <div className="profile-header">
                        <div>
                            <h1 className="profile-title">Profile</h1>
                            <p className="profile-subtitle">Manage your account settings</p>
                        </div>
                        {!isEditing && (
                            <button className="edit-icon-btn" onClick={handleEditToggle} title="Edit Profile">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className="profile-content">
                        <div className="profile-card profile-avatar-card">
                            <div className="profile-avatar-large">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </div>
                            <h2 className="profile-name-display">{formData.fullName}</h2>
                        </div>

                        <div className="profile-card profile-form-card">
                            <h3 className="section-header">Personal Information</h3>

                            <div className="info-group">
                                <div className="info-icon-label">
                                    <div className="info-icon user-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </div>
                                    <div className="info-details">
                                        <label className="info-label">Full Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className="profile-input"
                                            />
                                        ) : (
                                            <p className="info-value">{formData.fullName}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="info-group">
                                <div className="info-icon-label">
                                    <div className="info-icon email-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                            <polyline points="22,6 12,13 2,6"></polyline>
                                        </svg>
                                    </div>
                                    <div className="info-details">
                                        <label className="info-label">Email Address</label>
                                        <p className="info-value">{user?.email}</p>
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="profile-actions">
                                    <button className="save-btn" onClick={handleSave}>Save Changes</button>
                                    <button className="cancel-btn" onClick={handleEditToggle}>Cancel</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
