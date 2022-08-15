import express from 'express';
import MessageController from '../../controller/message.controller';

const messageRouter = express.Router();

messageRouter.post('/create', MessageController.createMessage);
messageRouter.post('/discussion', MessageController.getDiscussion);
messageRouter.post('/chat', MessageController.getChat);

export default messageRouter;