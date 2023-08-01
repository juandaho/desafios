import { Router } from "express";
import { ProductManager } from "../control/productManager.js";
import { __dirname } from "../utils.js";

const pManager = new ProductManager(__dirname + "/files/productos.json");

const router = Router();

router.get("/", async (req, res) => {
  const listaProducts = await pManager.getProduct({});
  res.render("home", { listaProducts });
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

export default router;
