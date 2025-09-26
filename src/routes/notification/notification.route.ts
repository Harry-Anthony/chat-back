import express from "express";
import NotificationController from "../../controller/notification.controller";

const notificationRouter = express.Router();

notificationRouter.post("/send", NotificationController.sendNotification);
notificationRouter.put("/update", NotificationController.updateToken);
notificationRouter.put("/seen", NotificationController.seenNotification);
notificationRouter.get("/", NotificationController.getAllNotification);
notificationRouter.get("/:userId", NotificationController.getNotification);


export default notificationRouter;
