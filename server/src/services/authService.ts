
import bcrypt from "bcrypt";
import { otpGenerator } from "../utils/otpGenerator";
import transporter from "../config/nodeMailerConfig";
import { IUserRepository } from "../interfaces/repositoryInterfaces/IUserRepository";
import { IAuthService } from "../interfaces/serviceInterfaces/IAuthService";
import { IJwtService } from "../interfaces/serviceInterfaces/IJwtService";
import { SignInResult, VerifyOtpResult } from "../types/authTypes";

export class AuthService implements IAuthService {
    private userRepository: IUserRepository;
    private jwtService: IJwtService;

    constructor(userRepository: IUserRepository, jwtService: IJwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    async signUp(fullName: string, email: string, password: string, confirmPassword: string): Promise<{ message: string; expiresIn: number }> {
        if (!fullName || !email || !password || !confirmPassword) {
            throw new Error("All fields are required");
        }
        if (password !== confirmPassword) {
            throw new Error("Passwords do not match");
        }

        const userExist = await this.userRepository.findByEmail(email);
        if (userExist && userExist.isVerified) {
            throw new Error("User already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = otpGenerator()
        const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
        const hashedOtp = await bcrypt.hash(otp, 10);

        if (!userExist) {
            await this.userRepository.create({
                fullName,
                email,
                password: hashedPassword,
                hashedOtp,
                otpExpiry,
            })
        }
        if (userExist && !userExist.isVerified) {
            await this.userRepository.update(userExist._id, {
                hashedOtp,
                otpExpiry,
            })
        }
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'Welcome to Task Management',
            text: `Your OTP is: ${otp}`,
        };
        await transporter.sendMail(mailOptions)
        const expiresIn = Math.floor(
            (otpExpiry.getTime() - Date.now()) / 1000
        );
        console.log("OTP sent successfully");

        return {
            message: "OTP sent successfully",
            expiresIn
        }
    }

    async verifyOtp(email: string, otp: string): Promise<VerifyOtpResult> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        if (user.isVerified) {
            throw new Error("User already verified");
        }

        if (!user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
            throw new Error("OTP has expired");
        }

        if (!user.hashedOtp) {
            throw new Error("OTP not found");
        }

        const isMatch = await bcrypt.compare(otp, user.hashedOtp);
        if (!isMatch) {
            throw new Error("Invalid OTP");
        }

        await this.userRepository.update(user._id, {
            isVerified: true,
            hashedOtp: "",
            otpExpiry: new Date(0)
        });

        const accessToken = this.jwtService.generateAccessToken(user._id.toString());
        const refreshToken = this.jwtService.generateRefreshToken(user._id.toString());

        return {
            accessToken,
            refreshToken,
            user: {
                id: user._id.toString(),
                email: user.email,
                fullName: user.fullName,
            }
        };
    }

    async signIn(email: string, password: string): Promise<SignInResult> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }

        if (!user.password) {
            throw new Error("Password login not available for this account");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }

        const accessToken = this.jwtService.generateAccessToken(user._id.toString());
        const refreshToken = this.jwtService.generateRefreshToken(user._id.toString());

        return {
            accessToken,
            refreshToken,
            user: {
                id: user._id.toString(),
                email: user.email,
                fullName: user.fullName,
            }
        };
    }
}