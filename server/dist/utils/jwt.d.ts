import { IJwtService } from "../interfaces/serviceInterfaces/IJwtService";
export declare class JwtService implements IJwtService {
    generateAccessToken(userId: string): string;
    generateRefreshToken(userId: string): string;
}
//# sourceMappingURL=jwt.d.ts.map