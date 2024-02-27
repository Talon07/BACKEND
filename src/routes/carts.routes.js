const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/cart-manajer-db.js");
const cartManager = new CartManager();

//1) creamos un nuevo carrito:

router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.crearCarrito();
    res.json(nuevoCarrito);
  } catch (error) {
    console.error("error al crear un nuevo carrito", error);
    res.status(500).json({ error: "error interno del servidor" });
  }
});

//2) Listamos los productos que pertenecen a tal carrito.
router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const carrito = await cartManager.getCarritoById(cartId);
    res.json(carrito.products);
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res
      .status(500)
      .strictContentLength({ error: "error interno del servidor" });
  }
});

//3) Agregar productos a diferentes carritos
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1; // Utilizamos req.body para obtener el campo "quantity" de la solicitud (En el futuro vamos a tomar la cantidad de un contador)

  try {
    const actualizarCarrito = await cartManager.agregarProductoAlCarrito(
      cartId,
      productId,
      quantity
    );
    res.json(actualizarCarrito.products);
  } catch (error) {
    console.error("Error al agregar producto al carrito", error);
    res.status(500).json({ error: "error interno del servidor" });
  }
});

module.exports = router;
