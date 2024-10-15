import express from "express";
import http from "http";
import { Server } from "socket.io";
import appRouter from "./routes/app.router";
import mongoose from "mongoose";
import { registerMessageHandlers } from "./socket/messageHandler";
// const { wakeDyno, wakeDynos } = require('heroku-keep-awake');
const app = express();

app.use(express.urlencoded({ extended: true }));
// This is required to handle urlencoded data
const port: number = 3001;
require("dotenv").config();
// requestListener <Function> A listener to be added to the 'request' event.
const httpServer = http.createServer(app);

const url = process.env.SERVER_KEEP_URL as string; // Replace with your Render URL
const interval = 40000; // Interval in milliseconds (30 seconds)

function reloadWebsite() {
  fetch(url)
    .then((response) => {
      console.log(
        `Reloaded at ${new Date().toISOString()}: Status Code ${
          response.status
        }`
      );
    })
    .catch((error) => {
      console.error(
        `Error reloading at ${new Date().toISOString()}:`,
        error.message
      );
    });
}

setInterval(reloadWebsite, interval);

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
/*
Vous pouvez également passer le port comme premier argument 
import { Server } from "socket.io";

const io = new Server(3000, {/options/})

io.on("connection", (socket) => {
    // ...
  });
This implicitly starts a Node.js HTTP server, which can be accessed through io.httpServer.
*/
// With an HTTP server
// mongoose.connect('mongodb://localhost:27017/chat', (error: any) => {
//   if (error) {
//     console.log('error mongo', error);
//   } else {
//     console.log('connected to database')
//   }
// });

// const remoteDb = "mongodb+srv://Harivola:GatlasBol1234@cluster0.a81wt47.mongodb.net/?retryWrites=true&w=majority"
// const remote url = https://chat-bol.herokuapp.com/
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_DB_URL}`,
  (error: any) => {
    if (error) {
      console.log("error mongo", error);
    } else {
      console.log("connected to database");
    }
  }
);

mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error:")
);
mongoose.connection.once("open", function () {
  const { db } = mongoose.connection;

  // Keep the connection alive
  setInterval(async () => {
    try {
      await db.admin().ping();
      console.log("Pinged MongoDB Atlas");
    } catch (err) {
      console.error("Error pinging MongoDB Atlas:", err);
    }
  }, 1000 * 60 * 60 * 6); // Ping every 60 seconds
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    // methods: ["GET", "POST"],
  },
});

app.use("/chat-harivola", appRouter);
app.get("/keep", (req, res) => {
  return res.status(200).send("ok");
});
io.on("connection", (socket) => {
  console.log("connection ");
  registerMessageHandlers(io, socket);
});

httpServer.listen(process.env.PORT || port, () => {
  // wakeDynos(DYNO_URLS);
});
