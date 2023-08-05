import {Router} from "express";
import CartManager from "../dao/mongomanagers/cartManagerMongo.js";
import ProductManager from "../dao/mongomanagers/productManagerMongo.js";

const cm = new CartManager();
const pm = new ProductManager();

const router = Router();


router.get("/carts", async (req, res) => {
    const carrito = await cm.getCarts();
    res.json({carrito});
});


router.get("/carts/:cid", async (req, res) => {
    const {cid} = req.params;
    const carrito = await cm.getCartById(cid);

    if (!carrito) {
        return res.status(404).json({message: `Cart with id ${cid} not found`});
    }

    res.json({status: "success", carrito});
});


router.post('/carts', async (req, res) => {
    try {
        const {obj} = req.body;

        if (!Array.isArray(obj)) {
            return res.status(400).send('Invalid request: products must be an array');
        }

        const validProducts = [];

        for (const product of obj) {
            const checkId = await pm.getProductById(product._id);
            if (checkId === null) {
                return res.status(404).send(`Product with id ${product._id} not found`);
            }
            validProducts.push(checkId);
        }

        const cart = await cm.addCart(validProducts);
        res.status(200).send(cart);

    } catch (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
});


router.post("/carts/:cid/products/:pid", async (req, res) => {
    const {cid, pid} = req.params;
    const {quantity} = req.body;

    try {
        const product = await pm.getProductById(pid);
        if (!product) {
            return res.status(404).send(`Product with id ${pid} not found`);
        }

        const cart = await cm.getCartById(cid);
        if (!cart) {
            return res.status(404).send(`Cart with id ${cid} not found`);
        }

        const updatedCart = await cm.addProductInCart(cid, { _id: pid, quantity: quantity });
        return res.status(200).send({
            message: `Product with id ${pid} added to cart with id ${cid}`,
            cart: updatedCart,
        });
    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).send({ message: "An error occurred while processing the request" });
    }
});

export default router;
