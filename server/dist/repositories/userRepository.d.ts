import { Types } from "mongoose";
import { IUser } from "../interfaces/entities/IUser";
import { IUserRepository } from "../interfaces/repositoryInterfaces/IUserRepository";
declare class UserRepository implements IUserRepository {
    constructor();
    create(user: Partial<IUser>): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    update(id: Types.ObjectId, user: Partial<IUser>): Promise<IUser | null>;
}
declare const _default: UserRepository;
export default _default;
//# sourceMappingURL=userRepository.d.ts.map