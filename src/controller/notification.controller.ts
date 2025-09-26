import mongoose from "mongoose";
import { INotification } from "../models/user/i_notification";
import { NotificationModel } from "../models/user/notification.model";
import { SettingModel } from "../models/user/setting.model";
import { sendFCMNotification } from "../services/firebase_service";
import { NotificationService } from "../services/notification.service";

export default class NotificationController {
  static async sendNotification(req: any, res: any) {
    const data = req.body as INotification;
    try {
      const notification = await NotificationService.createNotification({
        ...data,
        seen: false,
      });
      const setting = await SettingModel.findOne();
      if (setting) {
        await sendFCMNotification(
          setting.token,
          "Portfolio",
          data.name,
          notification._id.toString()
        );
      }
      res.status(200).json({
        message: "successful",
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  static async updateToken(req: any, res: any) {
    try {
      const setting = await SettingModel.findOne();
      const token = req.body.token;
      if (!setting) {
        const newSetting = new SettingModel({
          token,
        });
        await newSetting.save();
      } else {
        await SettingModel.updateOne(
          {
            _id: setting._id,
          },
          { token }
        );
      }
      res.status(204).json({
        message: "update setting successful",
      });
    } catch (error) {
      res.status(500).json({ message: "unable to update setting" });
    }
  }
  static async getAllNotification(req: any, res: any) {
    try {
      const notifications = await NotificationModel.find();
      res.status(200).json(notifications);
    } catch (error) {
      res.status(500).json({ error: "unable to get notification" });
    }
  }
  static async getNotification(req: any, res: any) {
    try {
      const _id = new mongoose.Types.ObjectId(req.params.userId);
      const notification = await NotificationModel.findById(_id);
      res.status(200).json(notification);
    } catch (error) {
      res.status(500).json({ error: "unable to get notification" });
    }
  }
  static async seenNotification(req: any, res: any) {
    try {
      const _id = new mongoose.Types.ObjectId(req.body.id);
      await NotificationModel.updateOne(
        {
          _id,
        },
        { seen: true }
      );
      res.status(200).json({
        message: "update setting successful",
        id: _id,
      });
    } catch (error) {
      res.status(500).json({ message: "unable to update notification" });
    }
  }
}
