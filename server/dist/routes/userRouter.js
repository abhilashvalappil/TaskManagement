"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authService_1 = require("../services/authService");
const userRepository_1 = __importDefault(require("../repositories/userRepository"));
const jwt_1 = require("../utils/jwt");
const cookieHandlerService_1 = require("../utils/cookieHandlerService");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userRouter = (0, express_1.Router)();
const jwtService = new jwt_1.JwtService();
const authService = new authService_1.AuthService(userRepository_1.default, jwtService);
const cookieHandlerService = new cookieHandlerService_1.CookieHandlerService();
const authController = new authController_1.AuthController(authService, cookieHandlerService);
userRouter.post('/auth/signup', authController.signUp.bind(authController));
userRouter.post('/auth/verify-otp', authController.verifyOtp.bind(authController));
userRouter.post('/auth/signin', authController.signIn.bind(authController));
userRouter.get("/auth/me", authMiddleware_1.authMiddleware, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});
exports.default = userRouter;
//# sourceMappingURL=userRouter.js.map