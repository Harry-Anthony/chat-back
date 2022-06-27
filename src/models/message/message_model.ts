import mongoose, { model, Types } from "mongoose";
import { IMessage } from "./i_message";


const MessageSchema = new mongoose.Schema<IMessage>({
    userSender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userReceiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
    }
});

export const MessageModel = model<IMessage>('Message', MessageSchema);


/*
db.users.find({ "$or": [
    { "name": { "$regex": "^Da"} }, 
    { "name": { "$regex": "^Ali" }}
]})
*/
/*
PersonModel.update(
    { _id: person._id }, 
    { $push: { friends: friend } },
    done
);
*/