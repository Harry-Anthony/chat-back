import { IMessage } from "../models/message/i_message";
import { ListMessageModel } from "../models/message/list_message_model";
import { MessageModel } from "../models/message/message_model";
import { UserDiscussionModel } from "../models/message/user_discussion_model";

export class MessageService {

    static async createMessage(message: IMessage) {
        const newMessage = new MessageModel(message);
        let data = await newMessage.save();
        const d = await ListMessageModel.findOne({
            "$or": [
                { idConcatenated: data.userSender + data.userReceiver },
                { idConcatenated: data.userReceiver + data.userSender },
            ],
        });
        if (!d) {
            let listMessageModel = new ListMessageModel({
                idConcatenated: data.userSender + data.userReceiver,
                allMessage: [data._id],
            });
            await listMessageModel.save();
        } else {
            d?.allMessage.push(data._id.toString());
            await d?.save();
        }
        data = await data.populate('userSender');
        data = await data.populate('userReceiver');
        return data;
    }

    static async getListMessage(firstId: string, secondId: string) {
        let listMessage = await ListMessageModel.findOne({
            "$or": [
                { idConcatenated: firstId + secondId },
                { idConcatenated: secondId + firstId },
            ],
        });
        if (listMessage) {
            listMessage = await listMessage!.populate('allMessage');
            listMessage = await listMessage.populate('allMessage.userSender');
            listMessage = await listMessage.populate('allMessage.userReceiver');
        }
        return listMessage;
    }

    static async getUserDiscussion(user: string) {
        let discussion = await UserDiscussionModel.findOne({
            user
        });
        if (discussion) {
            discussion = await discussion!.populate('user');
            discussion = await discussion!.populate('discussion.friend');
            discussion = await discussion!.populate('discussion.message');
            discussion = await discussion!.populate('discussion.message.userSender');
            discussion = await discussion!.populate('discussion.message.userReceiver');
        }
        return discussion
    }

    static async manageDiscussion(message: any, userId: string) {
        let friendId: string = "";
        let data: any;
        //todo manage discussion with user id
        if (message.userSender._id === userId) {
            friendId = message.userReceiver._id;
        } else {
            friendId = message.userSender._id;
        }
        let userDiscussion = await UserDiscussionModel.findOne({
            user: userId
        });
        if (userDiscussion) {
            let index = userDiscussion?.discussion.findIndex((i) => {
                return i.friend.toString() == friendId.toString();
            });
            if (index !== -1) {
                data = await UserDiscussionModel.updateOne({ user: userId }, {
                    $pullAll: {
                        discussion: [{ friend: friendId }],
                    },
                });
                if (!data.discussion) {
                    await UserDiscussionModel.updateOne({ user: userId }, {
                        discussion: [{
                            friend: friendId,
                            message: message._id
                        }],
                    });
                    data = await UserDiscussionModel.findOne({
                        user: userId
                    })
                } else {
                    data.discussion.push({
                        friend: friendId,
                        message: message._id
                    });
                    data = await data.save();
                }
            } else {
                userDiscussion?.discussion.push({
                    friend: friendId,
                    message: message._id
                });
                data = await userDiscussion?.save();
            }
        } else {
            let newData = new UserDiscussionModel({
                user: userId,
                discussion: [{
                    friend: friendId,
                    message: message._id
                }]
            });
            data = await newData.save();
        }
        data = await data.populate('user');
        data = await data.populate('discussion.friend');
        data = await data.populate('discussion.message');
        data = await data.populate('discussion.message.userSender');
        data = await data.populate('discussion.message.userReceiver');
        return data;
    }

}