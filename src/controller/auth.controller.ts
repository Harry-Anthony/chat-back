import { AuthService } from "../services/auth.service";
import bcrypt = require("bcrypt");
import * as speakeasy from "speakeasy";
import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import { Types } from "mongoose";

function generateToken(userId: Types.ObjectId): string {
  const db = new JsonDB(new Config("DataBase", true, false, "/"));
  const path = `user/${userId}`;
  const token = speakeasy.generateSecret();
  db.push(path, { userId, token });
  return token.base32;
}
export default class AuthController {
  static async register(req: any, res: any) {
    try {
      const userResult = await AuthService.checkUserMail(req.body.mail);
      if (!userResult) {
        const user = await AuthService.register(req.body);
        const userId = user._id;
        // const token = generateToken(userId);
        res.status(200).json({
          user: {
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            mail: user.mail,
          },
          // token: token,
        });
      } else {
        res.status(401).json({
          error: "mail déjà utilisé",
        });
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  static async login(req: any, res: any) {
    try {
      const user = await AuthService.login(req.body);
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt.compare(req.body.password, user.password).then((valid) => {
        if (!valid) {
          return res.status(401).json({ error: "Mot de passe incorrect !" });
        }
        const userId = user._id;
        // const token = generateToken(userId);
        res.status(200).json({
          user: {
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            mail: user.mail,
          },
          // token: token,
        });
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
