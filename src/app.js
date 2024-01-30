//*PRIMERA PRE ENTREGA - BACKEND*//

const express = require("express");
const app = express();
const PUERTO = 8080;
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.routes.js");

const ProductManager = require("../src/controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");

//Middleware
app.use(express.json());
//No se olviden!

//Mostramos los productos
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
//Escuchamos en el puerto
app.listen(PUERTO);
