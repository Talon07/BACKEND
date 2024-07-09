const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller.js");
const cartController = new CartController();

router.post("/", cartController.nuevoCarrito);
router.post(
  "/:cid/product/:pid",
  cartController.agregarProductoEnCarrito.bind(cartController)
);
router.get(
  "/:cid",
  cartController.obtenerProductosDeCarrito.bind(cartController)
);
router.delete(
  "/:cid/product/:pid",
  cartController.eliminarProductoDeCarrito.bind(cartController)
);
router.delete("/:cid", cartController.vaciarCarrito.bind(cartController));
router.post(
  "/:cid/purchase",
  cartController.finalizarCompra.bind(cartController)
);
router.put("/:cid", cartController.actualizarProductosEnCarrito);
router.put("/:cid/product/:pid", cartController.actualizarCantidades);

module.exports = router;
