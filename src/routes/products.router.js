const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");

//1) Listamos los productos
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;

    //Cargamos el array de productos con getProducts.
    const productos = await productManager.getProducts();

    //Si hay limite retornamos el limite y sino retornamos todo
    if (limit) {
      res.json(productos.slice(0, limit));
    } else {
      res.json(productos);
    }
  } catch (error) {
    console.log("Error al obtener los productos", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

//Traer un solo producto por id:
router.get("/:pid", async (req, res) => {
  let id = req.params.pid;

  try {
    const producto = await productManager.getProductById(parseInt(id));
    if (!producto) {
      res.json({
        error: "El producto no existe",
      });
    } else {
      res.json(producto);
    }
  } catch (error) {
    console.log("Error al obtener el producto", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

//Agregar un nuevo producto por post:
router.post("/", async (req, res) => {
  const nuevoProducto = req.body;
  console.log(nuevoProducto);

  try {
    await productManager.addProduct(nuevoProducto),
      res.status(201).json({ message: "Producto agregado correctamente" });
  } catch (error) {
    console.log("error al agregar un producto ", error);
    res.status(500).json({ error: "error del servidor" });
  }
});

//Actualizamos producto por id:
router.put("/:pid", async (req, res) => {
  let id = req.params.pid;
  const productoActualizado = req.body;

  try {
    await productManager.updateProduct(parseInt(id), productoActualizado);
    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    console.log("No pudimos actualizar, vamos a morir ", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

router.delete("/:pid", async (req, res) => {
  let id = req.params.pid;

  try {
    await productManager.deleteProduct(parseInt(id));
    res.json({ message: "Pruducto eliminado correctamente" });
  } catch (error) {
    console.log("No se pudo eliminar el producto");
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
