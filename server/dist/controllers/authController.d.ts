import { Request, Response, NextFunction } from "express";
import { IAuthService } from "../interfaces/serviceInterfaces/IAuthService";
import { ICookieHandlerService } from "../interfaces/serviceInterfaces/ICookieHandlerService";
export declare class AuthController {
    private authService;
    private cookieHandlerService;
    constructor(authService: IAuthService, cookieHandlerService: ICookieHandlerService);
    signUp(req: Request, res: Response, next: NextFunction): Promise<void>;
    verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
    signIn(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=authController.d.ts.map