import mongoose from "mongoose";
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

    static async getListMessage(firstId: string, secondId: string, lastIndex: string | null) {
        console.log("last index ==>", lastIndex);
        let limit: number = 15;
        try {
            let listMessage;
            if (lastIndex == null) {
                listMessage = await ListMessageModel.aggregate([
                    {
                        $match: {
                            "$or": [
                                { idConcatenated: firstId + secondId },
                                { idConcatenated: secondId + firstId },
                            ],
                        },
                    },
                    {
                        $project: {
                            messages: {
                                $slice: ["$allMessage", -limit]
                            },
                            count: {
                                $size: "$allMessage"
                            }
                        }
                    }
                ])
            } else {
                let last = new mongoose.Types.ObjectId(lastIndex);
                listMessage = await ListMessageModel.aggregate([
                    {
                        $match: {
                            "$or": [
                                { idConcatenated: firstId + secondId },
                                { idConcatenated: secondId + firstId },
                            ],
                        },
                    },
                    {
                        $project: {
                            messages: {
                                $cond: {
                                    if: {
                                        $gte: [
                                            {
                                                $subtract: [
                                                    {
                                                        $indexOfArray: ["$allMessage", last]
                                                    },
                                                    limit
                                                ]
                                            },
                                            0
                                        ]
                                    },
                                    then: {
                                        $slice: [
                                            "$allMessage",
                                            {
                                                $subtract: [
                                                    {
                                                        $indexOfArray: ["$allMessage", last]
                                                    },
                                                    limit
                                                ]
                                            },
                                            limit
                                        ]
                                    },
                                    else: {
                                        $slice: [
                                            "$allMessage",
                                            0,
                                            {
                                                $indexOfArray: ["$allMessage", last]
                                            }
                                        ]
                                    }
                                },
                            },
                            count: {
                                $size: "$allMessage"
                            }
                        }
                    }
                ]);
            }
            if (listMessage) {
                let temp = {
                    _id: listMessage[0]._id,
                    idConcatenated: listMessage[0].idConcatenated,
                    allMessage: listMessage[0].messages.map((e: any) => e.toString()),
                }
                let data = new ListMessageModel(temp);
                data = await data!.populate('allMessage');
                data = await data.populate('allMessage.userSender');
                data = await data.populate('allMessage.userReceiver');
                let result = JSON.parse(JSON.stringify(data));
                result.count = listMessage[0].count
                return result;
            }
            return null;
        } catch (error) {
            console.log("error = ", error)
        }
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
        if (message.userSender._id === userId) {
            friendId = message.userReceiver._id;
        } else {
            friendId = message.userSender._id;
        }
        let userDiscussion = await UserDiscussionModel.findOneAndUpdate(
            {
                user: userId
            },
            {
                $pull: {
                    discussion: { friend: friendId }
                },
            },
            {
                new: true
            }
        );
        if (userDiscussion) {
            // let index = userDiscussion?.discussion.findIndex((i) => {
            //     return i.friend.toString() == friendId.toString();
            // });
            userDiscussion?.discussion.push({
                friend: friendId,
                message: message._id
            });
            data = await userDiscussion?.save();
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