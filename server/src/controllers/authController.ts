
import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../interfaces/serviceInterfaces/IAuthService";
import { ICookieHandlerService } from "../interfaces/serviceInterfaces/ICookieHandlerService";
import { AuthRequest } from "../types/auth";

export class AuthController {
    private authService: IAuthService;
    private cookieHandlerService: ICookieHandlerService;

    constructor(authService: IAuthService, cookieHandlerService: ICookieHandlerService){
        this.authService = authService;
        this.cookieHandlerService = cookieHandlerService;
    }

    async signUp(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const { fullName, email, password, confirmPassword } = req.body;
            if (!fullName || !email || !password || !confirmPassword) {
                res.status(400).json({ error: "All fields are required" })
                return;
            }
            const result = await this.authService.signUp(fullName, email, password, confirmPassword);
            res.status(201).json({
                success: true,
                message: result.message,
                expiresIn: result.expiresIn
            })
        } catch (error) {
            next(error);
        }
    }

    async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                res.status(400).json({ error: "All fields are required" })
                return;
            }
            const result = await this.authService.verifyOtp(email, otp);
            this.cookieHandlerService.setAccessTokenCookie(res, result.accessToken);
            this.cookieHandlerService.setRefreshTokenCookie(res, result.refreshToken);
            res.status(201).json({
                success: true,
                message: "User verified successfully",
                user: result.user,
            });
        } catch (error) {
            next(error);
        }
    }

    async signIn(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ error: "All fields are required" })
                return;
            }
            const result = await this.authService.signIn(email, password);

            this.cookieHandlerService.setAccessTokenCookie(res, result.accessToken);
            this.cookieHandlerService.setRefreshTokenCookie(res, result.refreshToken);

            res.status(201).json({
                success: true,
                message: "User signed in successfully",
                user: result.user,
            });
        } catch (error) {
            next(error);
        }
    }

    async googleSignIn(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { token } = req.body;
            if (!token) {
                res.status(400).json({ error: "Google token is required" });
                return;
            }
            const result = await this.authService.googleSignIn(token);

            this.cookieHandlerService.setAccessTokenCookie(res, result.accessToken);
            this.cookieHandlerService.setRefreshTokenCookie(res, result.refreshToken);

            res.status(200).json({
                success: true,
                message: "User signed in with Google successfully",
                user: result.user,
            });
        } catch (error) {
            next(error);
        }
    }

    async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const user = await this.authService.getUserById(req.user.userId);
            res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            this.cookieHandlerService.clearAuthCookies(res);
            res.status(200).json({
                success: true,
                message: "Logged out successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.user?.userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }
            const { fullName } = req.body;
            if (!fullName) {
                res.status(400).json({ error: "Full name is required" });
                return;
            }
            const user = await this.authService.updateProfile(req.user.userId, fullName);
            res.status(200).json({
                success: true,
                message: "Profile updated successfully",
                user
            });
        } catch (error) {
            next(error);
        }
    }
}