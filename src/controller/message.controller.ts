import { IMessage } from "../models/message/i_message";
import { MessageService } from "../services/message.service";

export default class MessageController {
  static async createMessage(req: any, res: any) {
    try {
      const message = await MessageService.createMessage(req.body as IMessage);
      res.status(200).json({
        message,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async getDiscussion(req: any, res: any) {
    try {
      const discussion = await MessageService.getListMessage(
        req.body.firstId,
        req.body.secondId,
        req.body.lastIndex
      );
      res.status(200).json(discussion);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async getChat(req: any, res: any) {
    try {
      const messages = await MessageService.getUserDiscussion(req.body.user);
      res.status(200).json({
        messages,
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
