import { IUser } from "./i_user";
import mongoose, { model } from "mongoose";

const UserSchema = new  mongoose.Schema<IUser>({
    mail: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    avatar: String,
    password: {
        type: String, 
        required: true,
        select: false,
    }
});

export const UserModel = model<IUser>('User', UserSchema);
