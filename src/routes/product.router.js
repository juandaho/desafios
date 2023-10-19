
import { uploader } from "../utils.js";
import {
  deleteProduct,
  getProduct,
  getProducts,
  saveProduct,
  updateProduct,
  getMocksProducts,
} from "../controllers/product.controller.js";
import { authorizationRole, passportCall } from "../middleware/session.js";
import { Router } from "express";
import errorHandler from '../middleware/errors/index.js';
import toAsyncExpressDecorator from "async-express-decorator";

const router = toAsyncExpressDecorator(Router());

router.get("/mocking-products", getMocksProducts);
router.get(
  "/",
  passportCall("jwt"),
  authorizationRole(["user", "admin"]),
  getProducts
);

router.post("/", saveProduct);
router.get(
  "/:pid",
  passportCall("jwt"),
  authorizationRole(["user", "admin"]),
  getProduct
);
router.delete(
  "/:pid",
  passportCall("jwt"),
  authorizationRole(["admin"]),
  deleteProduct
);
router.put(
  "/:pid",
  passportCall("jwt"),
  authorizationRole(["admin"]),
  updateProduct
);
router.use(errorHandler);


export default router;
