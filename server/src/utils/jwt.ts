import jwt from "jsonwebtoken";
import { IJwtService } from "../interfaces/serviceInterfaces/IJwtService";

export class JwtService implements IJwtService {
    generateAccessToken(userId: string): string {
        return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
            expiresIn: "1h"
        });
    }

    generateRefreshToken(userId: string): string {
        return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET!, {
            expiresIn: "7d"
        });
    }
}