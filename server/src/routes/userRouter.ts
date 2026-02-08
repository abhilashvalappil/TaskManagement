

import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { AuthService } from "../services/authService";
import userRepository from "../repositories/userRepository";
import { JwtService } from "../utils/jwt";
import { CookieHandlerService } from "../utils/cookieHandlerService";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AuthRequest } from "../types/auth";
const userRouter = Router();

const jwtService = new JwtService();
const authService = new AuthService(userRepository,jwtService)
const cookieHandlerService = new CookieHandlerService();
const authController = new AuthController(authService,cookieHandlerService)

userRouter.post('/auth/signup',authController.signUp.bind(authController));
userRouter.post('/auth/verify-otp',authController.verifyOtp.bind(authController));
userRouter.post('/auth/signin',authController.signIn.bind(authController));
userRouter.post('/auth/google',authController.googleSignIn.bind(authController));
userRouter.post('/auth/logout',authController.logout.bind(authController));
userRouter.get("/auth/me",authMiddleware,authController.getMe.bind(authController));
userRouter.put("/auth/update-profile",authMiddleware,authController.updateProfile.bind(authController));

export default userRouter;