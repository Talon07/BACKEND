const express = require("express");
const router = express.Router();
const generarProductos = require("../utils/mock.js");

//MOCK FAKER
router.get("/mockingproducts", (req, res) => {
  //Generamos array de productos
  const productos = [];

  for (let i = 0; i < 100; i++) {
    productos.push(generarProductos());
  }
  res.json(productos);
});

module.exports = router;
