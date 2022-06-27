import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import appRouter from './routes/app.router';
import mongoose from 'mongoose';
import { registerMessageHandlers } from './socket/messageHandler';

const app = express();
const port: number = 3000;

// requestListener <Function> A listener to be added to the 'request' event.
const httpServer = http.createServer(app);
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
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
mongoose.connect('mongodb://localhost:27017/chat', (error: any) => {
  if (error) {
    console.log('error mongo', error);
  } else {
    console.log('connected to database')
  }
});

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

app.use('/chat-harivola', appRouter);

io.on("connection", (socket) => {
  registerMessageHandlers(io, socket);
});

httpServer.listen(port);




