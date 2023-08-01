import express from "express";
import viewRouter from "./routes/view.router.js";
import productRouter from "./routes/rutas_productos.js";
import cartRouter from "./routes/rutas_carrro.js";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import { Server, Socket } from "socket.io";

const app = express();
const PORT = 8080;

console.log(__dirname);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + "/public"));

const hbs = handlebars.create({
  defaultLayout: "main",
  extname: ".handlebars",
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/", viewRouter);

const httpServer = app.listen(PORT, () => {
  console.log("server is working");
});

const socketServer = new Server(httpServer);

import { ProductManager } from "./control/productManager.js";
const productManagerSocket = new ProductManager(
  __dirname + "/files/productos.json"
);

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado", socket.id);

  const listaProductos = await productManagerSocket.getProduct({});
  socket.emit("envio_productos", listaProductos);

  socket.on("addProduct", async (obj) => {
    await productManagerSocket.addProduct(obj);
    const listaProductos = await productManagerSocket.getProduct({});
    socketServer.emit("envio_productos", listaProductos);
  });

  socket.on("deleteProduct", async (id) => {
    try {
      await productManagerSocket.deleteProduct(id);

      const updatedProductList = await productManagerSocket.getProduct({});
      socket.emit("envio_productos", updatedProductList);
    } catch (error) {
      console.error("Error eliminando el producto:", error);
    }
  });
});
