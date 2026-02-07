import { Types } from "mongoose";
import { IUser } from "../interfaces/entities/IUser";
import { IUserRepository } from "../interfaces/repositoryInterfaces/IUserRepository";
import UserModel from "../models/userModel";

class UserRepository implements IUserRepository {
    constructor(){
    }

    async create(user: Partial<IUser>): Promise<IUser> {
        const newUser = new UserModel(user);
        return await newUser.save();
    }
         
    async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }
    
    async update(id: Types.ObjectId, user: Partial<IUser>): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(id, user, { new: true });
    }
        
}


export default new UserRepository();