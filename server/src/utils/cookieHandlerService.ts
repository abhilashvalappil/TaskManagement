import { Response } from "express";
import { ICookieHandlerService } from "../interfaces/serviceInterfaces/ICookieHandlerService";

export class CookieHandlerService implements ICookieHandlerService {

  private readonly isProd = process.env.NODE_ENV === "production";

  private get baseOptions() {
    return {
      httpOnly: true,
      secure: this.isProd,
      sameSite: this.isProd ? "strict" as const : "lax" as const,
      path: "/",
    };
  }

  setAccessTokenCookie(res: Response, token: string): void {
    res.cookie("accessToken", token, {
      ...this.baseOptions,
      maxAge: 59 * 60 * 1000, 
    });
  }

  setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie("refreshToken", token, {
      ...this.baseOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });
  }

  clearAuthCookies(res: Response): void {
    res.clearCookie("accessToken", this.baseOptions);
    res.clearCookie("refreshToken", this.baseOptions);
  }
}
