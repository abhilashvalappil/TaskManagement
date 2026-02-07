"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const otpGenerator_1 = require("../utils/otpGenerator");
const nodeMailerConfig_1 = __importDefault(require("../config/nodeMailerConfig"));
class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async signUp(fullName, email, password, confirmPassword) {
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
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const otp = (0, otpGenerator_1.otpGenerator)();
        const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);
        const hashedOtp = await bcrypt_1.default.hash(otp, 10);
        if (!userExist) {
            await this.userRepository.create({
                fullName,
                email,
                password: hashedPassword,
                hashedOtp,
                otpExpiry,
            });
        }
        if (userExist && !userExist.isVerified) {
            await this.userRepository.update(userExist._id, {
                hashedOtp,
                otpExpiry,
            });
        }
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'Welcome to Task Management',
            text: `Your OTP is: ${otp}`,
        };
        await nodeMailerConfig_1.default.sendMail(mailOptions);
        const expiresIn = Math.floor((otpExpiry.getTime() - Date.now()) / 1000);
        console.log("OTP sent successfully");
        return {
            message: "OTP sent successfully",
            expiresIn
        };
    }
    async verifyOtp(email, otp) {
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
        const isMatch = await bcrypt_1.default.compare(otp, user.hashedOtp);
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
    async signIn(email, password) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error("User not found");
        }
        if (!user.password) {
            throw new Error("Password login not available for this account");
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
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
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map