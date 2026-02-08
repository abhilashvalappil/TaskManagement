import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth/authSchema";
import type { LoginFormData } from "../schemas/auth/authSchema";
import { signIn, googleSignIn } from "../api/auth/authService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";
import { GoogleLogin } from "@react-oauth/google";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [serverError, setServerError] = React.useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            setServerError(null);
            if (credentialResponse.credential) {
                const res = await googleSignIn(credentialResponse.credential);
                if (res.success) {
                    dispatch(setUser(res.user));
                    navigate("/dashboard", { replace: true });
                }
            }
        } catch (error: any) {
            console.error("Google sign in failed:", error);
            const message = error.response?.data?.error || "Google sign in failed. Please try again.";
            setServerError(message);
        }
    };

    const onSubmit = async (data: LoginFormData) => {
        try {
            setServerError(null);
            const response = await signIn(data);
            if (response.success) {
                dispatch(setUser(response.user));
                navigate('/dashboard', { replace: true });
            }
        } catch (error: any) {
            console.error("Login failed:", error);
            const message = error.response?.data?.error || "Login failed. Please try again.";
            setServerError(message);
        }
    };

    return (
        <div className="login-container">
            <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="title">Welcome Back</h1>
                <p className="subtitle">
                    Sign in to continue managing your tasks
                </p>

                {serverError && (
                    <div className="server-error">
                        {serverError}
                    </div>
                )}

                <div className="input-group">
                    <label>Email</label>
                    <input placeholder="john@example.com" {...register("email")} />
                    {errors.email && (
                        <span className="error">{errors.email.message}</span>
                    )}
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        {...register("password")}
                    />
                    {errors.password && (
                        <span className="error">{errors.password.message}</span>
                    )}
                </div>

                <button type="submit" className="btn primary-btn" disabled={isSubmitting}>
                    {isSubmitting ? "Signing in..." : "Sign In"}
                </button>

                <div className="divider">
                    <span>OR</span>
                </div>

                <div className="google-login-wrapper">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log("Google login failed")}
                        width="100%"
                    />
                </div>

                <p className="footer-text">
                    Don't have an account?{" "}
                    <span className="link" onClick={() => navigate("/register")}>
                        Create Account
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;
