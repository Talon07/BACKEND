const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const PUERTO = 8081;
const productsRouter = require("./routes/products.routes.js");
const cartsRouter = require("./routes/carts.routes.js");

const path = require("path");

// iniciando db
require("./database.js");

// Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static("./src/public"));

// Server init
const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto ${PUERTO}`);
});

// Handlebars config
app.engine("handlebars", exphbs.engine({}));

app.set("view engine", "handlebars");
app.set("views", "src/views");

// Routes

app.use("/api/products", productsRouter);
app.use("/api/cart", cartsRouter);
