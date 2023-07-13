import express from "express";
import { ProductManager } from "./productManager.js";
const Productos = new ProductManager("../files/productos.json");

const app = express();
const PORT = 8080;

// Ruta para obtener todos los productos
app.get("/products", async (req, res) => {
  const { limite } = req.query;
  const products = await Productos.getProduct();
  if (limite) {
    const productosSolicitados = products.slice(0, limite);
    res.json({ status: "Carga exitosa", productosSolicitados });
  } else {
    res.json({ status: "Carga exitosa", products });
  }
});

// Ruta para obtener un producto por su ID
app.get("/products/:pid", async (req, res) => {
  const pid = Number(req.params.pid);

  const product = await Productos.getProductById(pid);
  if (product) {
    res.json({ status: "Carga exitosa", product });
  } else {
    res.status(404).json({ status: "Producto no encontrado" });
  }
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
  console.log("server is working");
});
