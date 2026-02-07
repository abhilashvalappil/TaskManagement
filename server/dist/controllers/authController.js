"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    constructor(authService, cookieHandlerService) {
        this.authService = authService;
        this.cookieHandlerService = cookieHandlerService;
    }
    async signUp(req, res, next) {
        try {
            const { fullName, email, password, confirmPassword } = req.body;
            if (!fullName || !email || !password || !confirmPassword) {
                res.status(400).json({ error: "All fields are required" });
                return;
            }
            const result = await this.authService.signUp(fullName, email, password, confirmPassword);
            res.status(201).json({
                success: true,
                message: result.message,
                expiresIn: result.expiresIn
            });
        }
        catch (error) {
            next(error);
        }
    }
    async verifyOtp(req, res, next) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                res.status(400).json({ error: "All fields are required" });
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
        }
        catch (error) {
            next(error);
        }
    }
    async signIn(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ error: "All fields are required" });
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
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map