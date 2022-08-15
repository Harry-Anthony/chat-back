import { JsonDB } from "node-json-db";
import { Config } from "node-json-db/dist/lib/JsonDBConfig";
import * as speakeasy from 'speakeasy';

export class AuthMiddleware {
  static async checkToken(req: any, res: any, next: any) {
    try {
      const db = new JsonDB(new Config("DataBase", true, false, '/'));
      const token = req.headers.authorization.split(' ')[1];
      const userId = req.body.userId;
      const path = `/user/${userId}`;
      const user = db.getData(path);
      const { base32: secret } = user.token;
      const verified = speakeasy.totp.verify({
        secret,
        encoding: 'base32',
        token
      });
      if (!verified) {
        throw 'Invalid user ID';
      } else {
        next();
      }
    } catch {
      res.status(401).json({
        error: new Error('Invalid request!')
      });
    }
  }
}