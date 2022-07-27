import { UserModel } from "../models/user/user.model";


export class UserService {
    static async searchUser(keyWord: string) {
        //todo search user with name
        const data = await UserModel.find( { 'name' : { '$regex' : keyWord, '$options' : 'i' } } );
        return data;
    }
}