import { Server, Socket } from "socket.io";
import { MessageService } from "../services/message.service";

export const registerMessageHandlers = (io: Server, socket: Socket) => {
  const createMessage = async (payload: any) => {
    console.log('create message')
    const message: any = await MessageService.createMessage(payload.body);
    const discUserSender = await MessageService.manageDiscussion(
      message,
      message.userSender._id
    );
    const discUserReceiver = await MessageService.manageDiscussion(
      message,
      message.userReceiver._id
    );
    io.emit(
      `message:create:${message.userSender._id}:${message.userReceiver._id}`,
      message
    );
    io.emit(
      `message:create:${message.userReceiver._id}:${message.userSender._id}`,
      message
    );
    io.emit(`discussion:${message.userSender._id}`, discUserSender);
    io.emit(`discussion:${message.userReceiver._id}`, discUserReceiver);
  };
  const readMessage = async (payload: any) => {
    const listMessage = await MessageService.getListMessage(
      payload.userId,
      payload.friendId,
      payload.lastIndex
    );
    io.emit(`message:${payload.userId}:${payload.friendId}`, listMessage);
  };
  const readDiscussion = async (payload: any) => {
    const discussion = await MessageService.getUserDiscussion(payload.userId);
    io.emit(`discussion:${payload.userId}`, discussion);
  };
  socket.on("message:create", createMessage);
  socket.on("message:read", readMessage);
  socket.on("discussion:read", readDiscussion);
};
