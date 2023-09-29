import { Router } from "express";
import CartController from '../controller/carts.controller.js';

// Instancia del controlador de carritos
const cc = new CartController();

const router = Router();

// Obtener todos los carritos
router.get('/', cc.get);  // Actualizado para usar 'get' de CartController

// Obtener un carrito específico por ID
router.get('/:cid', cc.getOne);  // Actualizado para usar 'getOne' de CartController

// Crear un nuevo carrito
router.post('/', cc.post);  // Actualizado para usar 'post' de CartController

// Actualizar un carrito específico por ID
router.put('/:cid', cc.put);  // Actualizado para usar 'put' de CartController

// Agregar un producto a un carrito específico
router.put('/:cid/products/:pid', cc.putProduct);  // Actualizado para usar 'putProduct' de CartController

// Eliminar un carrito específico por ID
router.delete('/:cid', cc.delete);  // Actualizado para usar 'delete' de CartController

// Eliminar un producto de un carrito específico
router.delete('/:cid/products/:pid', cc.deleteProduct);  // Actualizado para usar 'deleteProduct' de CartController

export default router;
