import { Route } from "react-router-dom";
import Registeration from "../pages/Registration";
import Dashboard from "../pages/Dashboard";
import OtpVerification from "../pages/OtpVerification";
import Login from "../pages/Login";
import Tasks from "../pages/Tasks";


const UserRoutes = () => (
    <>
        <Route>
            <Route path="/signup" element={<Registeration />} />
            <Route path="/signin" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/tasks" element={<Tasks />} />
        </Route>
    </>
)

export default UserRoutes;
