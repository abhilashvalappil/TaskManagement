import { SignInResult, VerifyOtpResult } from "../../types/authTypes";
export interface IAuthService {
    signUp(fullName: string, email: string, password: string, confirmPassword: string): Promise<{
        message: string;
        expiresIn: number;
    }>;
    verifyOtp(email: string, otp: string): Promise<VerifyOtpResult>;
    signIn(email: string, password: string): Promise<SignInResult>;
}
//# sourceMappingURL=IAuthService.d.ts.map