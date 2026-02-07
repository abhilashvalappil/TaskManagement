"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieHandlerService = void 0;
class CookieHandlerService {
    constructor() {
        this.isProd = process.env.NODE_ENV === "production";
    }
    get baseOptions() {
        return {
            httpOnly: true,
            secure: this.isProd,
            sameSite: this.isProd ? "strict" : "lax",
            path: "/",
        };
    }
    setAccessTokenCookie(res, token) {
        res.cookie("accessToken", token, {
            ...this.baseOptions,
            maxAge: 59 * 60 * 1000,
        });
    }
    setRefreshTokenCookie(res, token) {
        res.cookie("refreshToken", token, {
            ...this.baseOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }
    clearAuthCookies(res) {
        res.clearCookie("accessToken", this.baseOptions);
        res.clearCookie("refreshToken", this.baseOptions);
    }
}
exports.CookieHandlerService = CookieHandlerService;
//# sourceMappingURL=cookieHandlerService.js.map