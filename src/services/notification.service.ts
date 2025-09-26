import { INotification } from "../models/user/i_notification";
import { NotificationModel } from "../models/user/notification.model";

export class NotificationService {
    static async createNotification(notification: INotification) {
        const newNotification = new NotificationModel(notification);
        const data = await newNotification.save();
        return data;
    }
}