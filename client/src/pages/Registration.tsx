import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/auth/authSchema";
import type { RegisterFormData } from "../schemas/auth/authSchema";
import { signUp, googleSignIn } from "../api/auth/authService";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/slices/authSlice";

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
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

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);
      const res = await signUp(data)
      if (res.success) {
        navigate('/verify-otp', {
          state: {
            email: data.email,
            expiresIn: res.expiresIn
          }
        })
      }
    } catch (error: any) {
      const message = error.response?.data?.error || "Registration failed. Please try again.";
      setServerError(message);
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="title">Create Account</h1>
        <p className="subtitle">
          Create account and start managing your tasks
        </p>

        {serverError && (
          <div className="server-error">
            {serverError}
          </div>
        )}

        <div className="input-group">
          <label>Full Name</label>
          <input placeholder="John Doe" {...register("fullName")} />
          {errors.fullName && (
            <span className="error">{errors.fullName.message}</span>
          )}
        </div>

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

        <div className="input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="error">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button type="submit" className="btn primary-btn" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Account"}
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
          Already have an account?{" "}
          <span className="link" onClick={() => navigate("/")}>
            Sign In
          </span>
        </p>
      </form>
    </div>
  );
};

export default Registration;
