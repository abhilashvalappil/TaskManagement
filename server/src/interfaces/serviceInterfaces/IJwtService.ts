export interface IJwtService {
    generateAccessToken(userId: string): string;
    generateRefreshToken(userId: string): string;
}