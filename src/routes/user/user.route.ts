import express from 'express';
import UserController from '../../controller/user_controller';

const userRouter = express.Router();

userRouter.post('/searchUser', UserController.searchUser);

export default userRouter;