"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtService {
    generateAccessToken(userId) {
        return jsonwebtoken_1.default.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1h"
        });
    }
    generateRefreshToken(userId) {
        return jsonwebtoken_1.default.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: "7d"
        });
    }
}
exports.JwtService = JwtService;
//# sourceMappingURL=jwt.js.map