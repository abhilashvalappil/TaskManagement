import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schemas/auth/authSchema";
import type { LoginFormData } from "../schemas/auth/authSchema";
import { signIn } from "../api/auth/authService";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormData) => {
        console.log(data);
        const response = await signIn(data);
        if(response.success){
            navigate('/dashboard');
        }
    };

    return (
        <div className="login-container">
            <form className="login-card" onSubmit={handleSubmit(onSubmit)}>
                <h1 className="title">Welcome Back</h1>
                <p className="subtitle">
                    Sign in to continue managing your tasks
                </p>

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

                <p className="footer-text">
                    Don't have an account?{" "}
                    <a href="/register" className="link">
                        Create Account
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Login;
