import {Router} from "express";
import ProductManager from "../dao/mongomanagers/productManagerMongo.js";

const manager = new ProductManager();

const router = Router();


router.get("/products", async (req, res) => {
  const products = await manager.getProducts();

  if (products.length === 0) {
    return res.json("No hay productos en la tienda");
  }

  res.json({message: "success", products});
});


router.get("/products/:pid", async (req, res) => {
  const {pid} = req.params;
  const product = await manager.getProductbyId(pid);

  if (!product) {
    return res.status(404).json({message: `Product with id ${pid} not found`});
  }

  res.json({status: "success", product});
});


router.post("/products", async (req, res) => {
  const product = req.body;
  const newProduct = await manager.addProduct(product);

  if (!newProduct) {
    return res.status(400).json({message: "Error creating product"});
  }

  res.json({status: "success", newProduct});
});


router.put("/products/:pid", async (req, res) => {
  const {pid} = req.params;
  const product = req.body;
  const updatedProduct = await manager.updateProduct(pid, product);

  if (!updatedProduct) {
    return res.status(404).json({message: `Product with id ${pid} not found`});
  }

  res.json({status: "success", updatedProduct});
});


router.delete("/products/:pid", async (req, res) => {
  const {pid} = req.params;
  const deletedProduct = await manager.deleteProduct(pid);

  if (!deletedProduct) {
    return res.status(404).json({message: `Product with id ${pid} not found`});
  }

  res.json({status: "success", deletedProduct});
});

export default router;
