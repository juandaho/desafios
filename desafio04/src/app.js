import express from "express";
import viewRouter from "./routes/view.router.js";
import productRouter from "./routes/rutas_productos.js";
import cartRouter from "./routes/rutas_carrro.js";
import {__dirname} from "./utils.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";


const app = express();
const PORT = 8080;

console.log(__dirname);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Static files
app.use(express.static(__dirname + "/public"));

// Handlebars configuration
const hbs = handlebars.create({
    defaultLayout: 'main',
    extname: '.handlebars'
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + "/views");

// Routes
app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/", viewRouter);


const httpServer = app.listen(PORT, () => {
    console.log("server is working");
});

const socketServer = new Server(httpServer)



socketServer.on("connection", (socket)=>{

    console.log("Cliente conectado", socket.id)

})