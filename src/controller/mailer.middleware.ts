import nodemailer from "nodemailer";

export default class MailerController {
  static async sendMessage(req: any, res: any) {
    const { body } = req;
    console.log('body', body, req.body)
    try {
      console.log("sender", {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_SENDER_PWD,
      });
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_SENDER,
          pass: process.env.MAIL_SENDER_PWD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      const mailOptions = {
        from: body.mail,
        to: process.env.MAIL_RECEIVER,
        subject: `Mail from ${body.name}`,
        text: body.text,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email: ", error);
          res.status(500).json({ error });
        } else {
          console.log("Email sent: ", info.response);
        }
      });
      res.status(200).json({
        message: "success",
      });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
