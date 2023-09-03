import express from 'express';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import session from "express-session";
import MongoStore from "connect-mongo";

import cartRouter from './routes/carts.routes.js';
import productRouter from './routes/products.routes.js';
import viewsRouter from './routes/views.routes.js';
import messageRouter from './routes/messages.routes.js';
import sessionRouter from './routes/session.routes.js';

import handlebars from 'express-handlebars';

import Message from './dao/dbManagers/messages.js';
import Product from './dao/dbManagers/products.js';
const mm = new Message();
const pm = new Product();

mongoose.set("strictQuery", false); 
const app = express();
const port = 8080;

const connection = mongoose.connect('mongodb+srv://juandaho:conexion12abc@cluster0.buwlub1.mongodb.net/mydatabase?retryWrites=true&w=majority');
                                                                                        

app.use(session({
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://juandaho:conexion12abc@cluster0.buwlub1.mongodb.net/mydatabase?retryWrites=true&w=majority',
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 60 * 5
    }),
    secret: "secretCoder",
    resave: false,
    saveUnitialized: false
}))

app.engine('handlebars', handlebars.engine());
app.set("views", __dirname+"/views");
app.set("view engine", 'handlebars');
app.use('/', viewsRouter);

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/carts', cartRouter);
app.use('/api/products', productRouter);
app.use('/api/messages', messageRouter);
app.use('/api/session', sessionRouter);

const httpServer = app.listen(port, () => console.log(`Server listening on port ${port}`));
export const io = new Server(httpServer);

let messages = await mm.getAll();
let products = await pm.getAll();

io.on('connection', socket => {
    console.log("Se inicio la comunicacion");

    socket.on('products', data => { 
        io.emit(data); 
    })

    socket.on("message", data => { 
        messages.push(data);
        
        io.emit('Messages', messages);
    })

    socket.on('authenticated', data => { 
        socket.broadcast.emit('newUserConnected', data);
        socket.emit('Messages', messages);
    })

    socket.emit('products', products);
    
    socket.on('products', data => { 
        products.push(data);
        io.emit('products', products);
    })
})