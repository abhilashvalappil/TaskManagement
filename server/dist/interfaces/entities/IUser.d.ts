import { Document, Types } from "mongoose";
export interface IUser extends Document {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    password?: string;
    hashedOtp?: string;
    otpExpiry?: Date;
    isVerified: boolean;
    googleId?: string;
    profile?: string;
    isGoogleAuth?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=IUser.d.ts.map