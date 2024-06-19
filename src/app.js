const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const PUERTO = 8080;
require("./database.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const initializePassport = require("./config/passport.config.js");
const passport = require("passport");
const manejadorError = require("./middleware/error.js");
const addLogger = require("./utils/logger.js");

const sessionRouter = require("./routes/sessions.router.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const mockRouter = require("./routes/mock.router.js");
const loggerRouter = require("./routes/logger.routes.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(manejadorError);
app.use(addLogger);
// app.use(express.static("./src/public"));
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

//Cambios passport:
app.use(passport.initialize());
app.use(passport.session());
initializePassport();
app.use(cookieParser());

//AuthMiddleware
// const authMiddleware = require("./middleware/authmiddleware.js");
// app.use(authMiddleware);

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);
app.use("/", mockRouter);
app.use("/", loggerRouter);

//Session
//Renderizamos Login de usuario con session
app.get("/login", (req, res) => {
  let usuario = req.query.usuario;
  req.session.usuario = usuario;
  // res.send("guardamos el usuario por medio de query");
  res.render("login");
});

//Ruta de inicio de sesion con facebook:
app.get("/auth/facebook", passport.authenticate("facebook"));

//Ruta callback
app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/inicio",
    failureRedirect: "/login",
  })
);

//Ruta protegida que requiere de inicio de sesion:
app.get("/inicio", (req, res) => {
  if (req.isAuthenticated()) {
    let { displayName, provider } = req.user;
    res.render("inicio", { displayName, provider });
  } else {
    res.redirect("/login");
  }
});

//Ruta de cierre de sesion:
app.get("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      console.log(error);
      return res.redirect("/");
    }
    return res.redirect("/login");
  });
});

//Verificamos el usuario:

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

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

//1) Instalamos swagger:
//npm install swagger-jsdoc swagger-ui-express

//swagger-jsdoc: nos deja escribir la configuracion en un archivo .yaml (tambien json)  y a partir de ahi se genera un apidoc.

//swagger-ui-express: nos permitirá linkear una interfaz gráfica para poder visualizar la documentacion.

//2) Importamos los módulos:

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");

// Creamos un objeto de configuración: swaggerOptions
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

// Conectamos Swagger a nuestro servidor de Express
const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
