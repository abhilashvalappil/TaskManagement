import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/auth/authSchema";
import type { RegisterFormData } from "../schemas/auth/authSchema";
import { signUp } from "../api/auth/authService";
import { useNavigate } from "react-router-dom";

const Registeration: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

  

  const onSubmit = async(data: RegisterFormData) => {
    console.log(data);
    const res = await signUp(data)
    if(res.success){
        navigate('/verify-otp',{
          state: {
            email: data.email,
            expiresIn: res.expiresIn
          }
        })
    }
  };

  return (
    <div className="register-container">
      <form className="register-card" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="title">Create Account</h1>
        <p className="subtitle">
          Create account and start managing your tasks
        </p>

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
      </form>
    </div>
  );
};
 

export default Registeration;
