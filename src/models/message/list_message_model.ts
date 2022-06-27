import mongoose, { model } from "mongoose";
import { ListMessage } from "./i_listMessage";

const ListMessageSchema = new mongoose.Schema<ListMessage>({
    idConcatenated: {
        type: String,
        required: true,
    },
    allMessage: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Message'
    }]
});


export const ListMessageModel = model<ListMessage>('listMessage', ListMessageSchema);