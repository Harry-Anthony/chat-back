import express from 'express';
import authRouter from "./auth/auth.route";
import messageRouter from "./message/message.route";


const appRouter = express.Router();

appRouter.use('/auth', authRouter);
appRouter.use('/message', messageRouter);

export default appRouter;