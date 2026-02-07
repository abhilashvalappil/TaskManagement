
import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../interfaces/serviceInterfaces/IAuthService";
import { ICookieHandlerService } from "../interfaces/serviceInterfaces/ICookieHandlerService";

export class AuthController {
    private authService: IAuthService;
    private cookieHandlerService: ICookieHandlerService;

    constructor(authService: IAuthService, cookieHandlerService: ICookieHandlerService){
        this.authService = authService;
        this.cookieHandlerService = cookieHandlerService;
    }

    async signUp(req:Request, res:Response, next: NextFunction): Promise<void> {
        try {
            const {fullName, email, password, confirmPassword} = req.body;
            if(!fullName || !email || !password || !confirmPassword){
                res.status(400).json({error:"All fields are required"})
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
            const {email, password} = req.body;
            if(!email || !password){
                res.status(400).json({error:"All fields are required"})
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
}