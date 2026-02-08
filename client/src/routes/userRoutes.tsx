import { Route } from "react-router-dom";
import Registration from "../pages/Registration";
import Dashboard from "../pages/Dashboard";
import OtpVerification from "../pages/OtpVerification";
import Login from "../pages/Login";
import Tasks from "../pages/Tasks";
import Analytics from "../pages/Analytics";
import Profile from "../pages/Profile";
import ProtectedRoute from "../components/guards/ProtectedRoute";
import GuestRoute from "../components/guards/GuestRoute";

const UserRoutes = () => (
    <>
        {/* Guest Routes: Only accessible if NOT logged in */}
        <Route element={<GuestRoute />}>
            <Route path="/register" element={<Registration />} />
            <Route path="/" element={<Login />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
        </Route>

        {/* Protected Routes: Only accessible if logged in */}
        <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
        </Route>
    </>
)

export default UserRoutes;
