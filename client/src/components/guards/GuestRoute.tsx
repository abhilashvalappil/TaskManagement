import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const GuestRoute: React.FC = () => {
    const { user } = useSelector((state: any) => state.auth);

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default GuestRoute;
