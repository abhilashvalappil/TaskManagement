import React, { useEffect, useState } from 'react';
import { Routes } from 'react-router-dom'
import './App.css'
import './index.css'
import UserRoutes from './routes/userRoutes'
import { useDispatch } from 'react-redux';
import { setUser } from './redux/slices/authSlice';
import API from './utils/axiosInstance';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await API.get('/auth/me');
        if (response.data.success) {
          dispatch(setUser(response.data.user));
        }
      } catch (error) {
        console.log('No active session');
      } finally {
        setIsInitializing(false);
      }
    };
    initAuth();
  }, [dispatch]);

  if (isInitializing) {
    return <div className="loading-screen">Loading...</div>; // Simple loading state
  }

  return (
    <Routes>
      {UserRoutes()}
    </Routes>
  )
}

export default App
