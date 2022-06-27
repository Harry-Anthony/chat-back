import mongoose, { model } from "mongoose";
import { IUserDiscussion } from "./i_user_discussion";

const UserDiscussionSchema = new mongoose.Schema<IUserDiscussion>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    discussion: [{
        friend: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    }]
});

export const UserDiscussionModel = model<IUserDiscussion>('userDiscussion', UserDiscussionSchema);
