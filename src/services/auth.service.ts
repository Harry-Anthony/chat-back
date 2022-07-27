import { IUser } from "../models/user/i_user";
import { UserModel } from "../models/user/user.model";
import bcrypt = require("bcrypt");

export class AuthService {
    static async register(user: IUser) {
        let hash = await bcrypt.hash(user.password, 10)
        const newUser = new UserModel({
            mail: user.mail,
            name: user.name,
            avatar: null,
            password: hash
        });
        return await newUser.save();
    }

    static async login(data: any) {
        return await UserModel.findOne({ mail: data.mail }).select('+password');
    }

    static async checkUserMail(mail: string): Promise<boolean> {
        const user = await UserModel.findOne({mail});
        if(user) {
            return true;
        } 
        return false;
    }
}