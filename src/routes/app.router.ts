import express from 'express';
import authRouter from "./auth/auth.route";
import messageRouter from "./message/message.route";
import userRouter from './user/user.route';


const appRouter = express.Router();

appRouter.use('/auth', authRouter);
appRouter.use('/message', messageRouter);
appRouter.use('/user', userRouter);

export default appRouter;