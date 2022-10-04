import { UserService } from "../services/user_service";


export default class UserController {
    static async searchUser(req: any, res: any) {
        try {
            const users = await UserService.searchUser(req.body.keyWord);
            res.status(200).json({
                users
            });
        } catch (error) {
            res.status(500).json({ error });
        }
    }
}