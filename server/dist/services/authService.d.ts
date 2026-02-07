import { IUserRepository } from "../interfaces/repositoryInterfaces/IUserRepository";
import { IAuthService } from "../interfaces/serviceInterfaces/IAuthService";
import { IJwtService } from "../interfaces/serviceInterfaces/IJwtService";
import { SignInResult, VerifyOtpResult } from "../types/authTypes";
export declare class AuthService implements IAuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: IUserRepository, jwtService: IJwtService);
    signUp(fullName: string, email: string, password: string, confirmPassword: string): Promise<{
        message: string;
        expiresIn: number;
    }>;
    verifyOtp(email: string, otp: string): Promise<VerifyOtpResult>;
    signIn(email: string, password: string): Promise<SignInResult>;
}
//# sourceMappingURL=authService.d.ts.map