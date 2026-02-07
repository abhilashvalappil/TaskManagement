import { Response } from "express";

export interface ICookieHandlerService {
  setAccessTokenCookie(
    res: Response,
    accessToken: string
  ): void;

  setRefreshTokenCookie(
    res: Response,
    refreshToken: string
  ): void;

  clearAuthCookies(
    res: Response
  ): void;
}
