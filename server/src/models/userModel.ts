
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces/entities/IUser';

const UserSchema: Schema<IUser> = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
    },
     hashedOtp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
    },
    profile: {
        type: String,
    },
    isGoogleAuth: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);