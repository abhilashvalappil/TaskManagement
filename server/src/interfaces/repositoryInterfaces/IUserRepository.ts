import { Types } from "mongoose";
import { IUser } from "../entities/IUser";

export interface IUserRepository {
    create(user: Partial<IUser>): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    update(id: Types.ObjectId, user: Partial<IUser>): Promise<IUser | null>;
}