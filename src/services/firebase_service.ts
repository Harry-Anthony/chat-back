import admin from "firebase-admin";
import fs from 'fs'

// require("dotenv").config();

const filePath = "/etc/secrets/portfolio.json";
const rawData = fs.readFileSync(filePath, "utf-8");
const serviceAccount = JSON.parse(rawData);

// const account = {
//   "type": "service_account",
//   "project_id": process.env.PROJECT_ID,
//   "private_key_id": process.env.PRIVATE_KEY_ID,
//   "private_key": process.env.PRIVATE_KEY,
//   "client_email": process.env.CLIENT_EMAIL,
//   "client_id": process.env.CLIENT_ID,
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": process.env.CERT_URL,
//   "universe_domain": "googleapis.com"
// }
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendFCMNotification = async (
  deviceToken: string,
  title: string,
  body: string,
  notifId: string
) => {
  // Ensure all values in data are strings
  const formattedData = {
    notifId,
  };

  const payload = {
    notification: {
      title: title,
      body: body,
    },
    data: formattedData,
  };

  // Send the notification to a specific device token using send()
  try {
    await admin.messaging().send({
      token: deviceToken, // This is the device token you're targeting
      notification: payload.notification,
      data: payload.data,
    });
  } catch (error) {
    throw Error("unable to send notification");
  }
};

export { admin, sendFCMNotification };
