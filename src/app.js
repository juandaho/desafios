
import { __dirname, PORT } from "./utils.js";

import CartRouterClass from "./routes/cart.router.js";
import ProductsRouterClass from "./routes/product.router.js";
import ViewsRouterClass from "./routes/view.router.js";
import SessionRouterClass from "./routes/session.router.js";
import MessageRouterClass from './routes/message.router.js';

import handlebars from "express-handlebars";

import express from "express";

import cors from "cors";

import { Server } from "socket.io";

import cookieParser from "cookie-parser";

import passport from "passport";
import initializePassport from "./config/passport.config.js";
import { MESSAGE_SERVICES } from "./services/servicesManager.js";
import dotenv from 'dotenv';
import errorHandler from './middleware/errors/index.js'

dotenv.config();


const app = express();

const viewsRouter = new ViewsRouterClass();
const cartRouter = new CartRouterClass();
const sessionRouter = new SessionRouterClass();

const messageRouterClass = new MessageRouterClass()

initializePassport();
app.use(passport.initialize());
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/", viewsRouter.getRouter());
app.use("/api/session", sessionRouter.getRouter());
app.use("/api/carts", cartRouter.getRouter());
app.use("/api/chat", messageRouterClass.getRouter());
// app.use("/api/products", productRouter.getRouter());
app.use("/api/products", ProductsRouterClass);
app.all(errorHandler);

const socketio = app.listen(PORT, () =>
console.log(`Server running at http://localhost:${PORT}`)
);

const io = new Server(socketio);
app.set("socketio", io);

io.on("connection", (socket) => {  
  socket.on("newuser", async ({ user }) => {
    socket.broadcast.emit("newuserconnected", { user: user });
    let messages = await MESSAGE_SERVICES.getMessages();
    io.emit("messageLogs", messages);
  });
});
