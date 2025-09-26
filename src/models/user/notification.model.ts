import { INotification } from "./i_notification";
import mongoose, { model } from "mongoose";

const NotificationSchema = new  mongoose.Schema<INotification>({
    mail: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    details: {
        type: String, 
        required: true,
    },
    phone: String,
    seen: Boolean
});

export const NotificationModel = model<INotification>('Notification', NotificationSchema);
