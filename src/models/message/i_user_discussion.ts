import { IDiscussion } from "./i_discussion";

export interface IUserDiscussion {
    user: string;
    discussion: IDiscussion[];
}