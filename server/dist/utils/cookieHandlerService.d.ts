import { Response } from "express";
import { ICookieHandlerService } from "../interfaces/serviceInterfaces/ICookieHandlerService";
export declare class CookieHandlerService implements ICookieHandlerService {
    private readonly isProd;
    private get baseOptions();
    setAccessTokenCookie(res: Response, token: string): void;
    setRefreshTokenCookie(res: Response, token: string): void;
    clearAuthCookies(res: Response): void;
}
//# sourceMappingURL=cookieHandlerService.d.ts.map