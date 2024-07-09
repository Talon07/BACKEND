const express = require("express");
const http = require("http");
const path = require("path");
const exphbs = require("express-handlebars");
const socketIo = require("socket.io");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const manejadorError = require("./middleware/error.js");
const addLogger = require("./utils/logger.js");
const SocketManager = require("./sockets/socketmanager");
const nodemailer = require("nodemailer");
require("dotenv").config();

require("./database.js");

const PUERTO = 8080;

//Credenciales
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const app = express();

const server = http.createServer(app);

//Socket
const io = socketIo(server);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(manejadorError);
app.use(addLogger);
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: "secretCoder",
    resave: false,
    saveUninitialized: false,
  })
);

// Configuración de Passport
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

// Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
const sessionRouter = require("./routes/sessions.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const mockRouter = require("./routes/mock.router.js");
const loggerRouter = require("./routes/logger.routes.js");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);
app.use("/", mockRouter);
app.use("/", loggerRouter);

app.get("/carts", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "carts.handlebars"));
});

// Renderizado de Login con session
app.get("/login", (req, res) => {
  let usuario = req.query.usuario;
  req.session.usuario = usuario;
  res.render("login");
});

// Ruta de inicio de sesión con Facebook
app.get("/auth/facebook", passport.authenticate("facebook"));

// Ruta callback
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/inicio",
    failureRedirect: "/login",
  })
);

// Ruta protegida que requiere inicio de sesión
app.get("/inicio", (req, res) => {
  if (req.isAuthenticated()) {
    let { displayName, provider } = req.user;
    res.render("inicio", { displayName, provider });
  } else {
    res.redirect("/login");
  }
});

// Ruta de cierre de sesión
app.get("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      console.log(error);
      return res.redirect("/");
    }
    return res.redirect("/login");
  });
});

// Verificación de usuario
app.get("/usuario", (req, res) => {
  if (req.session.usuario) {
    const usuario = req.session.usuario;
    const mensaje = `El usuario registrado es: 
    ${usuario.first_name}
    ${usuario.last_name}`;
    return res.send(mensaje);
  } else {
    res.send("No tenemos un usuario registrado");
  }
});

// Inicialización de SocketManager
new SocketManager(io);

// Configuración de Swagger
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion de la App Tienda Marolio",
      description: "E-commerce",
    },
  },
  apis: ["./src/docs/**/*.yaml"],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Inicio del servidor
server.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

module.exports = { app, server, io };
