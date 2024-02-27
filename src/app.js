//*4TO DESAFIO - BACKEND*//

const express = require("express");
const app = express();
const PUERTO = 8080;
const exphbs = require("express-handlebars");
const socket = require("socket.io");
require("./database.js");

//Views
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.routes.js");
//const viewsRouter = require("./routes/views.router.js");

//Obtenemos el array de productos:
const ProductManager = require("../src/controllers/product-manager-db.js");
const productManager = new ProductManager("./src/models/productos.json");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas: donde van a estar los productos
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
//app.use("/", viewsRouter);

//Escuchamos en el puerto y guardamos la constancia para utilizar despues con socket
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto ${PUERTO}`);
});
