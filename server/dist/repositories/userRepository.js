"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userModel_1 = __importDefault(require("../models/userModel"));
class UserRepository {
    constructor() {
    }
    async create(user) {
        const newUser = new userModel_1.default(user);
        return await newUser.save();
    }
    async findByEmail(email) {
        return await userModel_1.default.findOne({ email });
    }
    async update(id, user) {
        return await userModel_1.default.findByIdAndUpdate(id, user, { new: true });
    }
}
exports.default = new UserRepository();
//# sourceMappingURL=userRepository.js.map