import express from 'express';
import authRouter from "./auth/auth.route";
import messageRouter from "./message/message.route";
import userRouter from './user/user.route';
import MailerController from '../controller/mailer.middleware';


const appRouter = express.Router();

appRouter.use('/auth', authRouter);
appRouter.use('/message', messageRouter);
appRouter.use('/user', userRouter);
appRouter.post('/mail', MailerController.sendMessage)
appRouter.get('/get-ip', async (req: any, res: any) => {
    try {
      const ip = req.query.ip;
      const result = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await result.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error });
    }
  })

export default appRouter;
