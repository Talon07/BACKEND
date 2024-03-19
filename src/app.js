const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const PUERTO = 8080;
require("./database.js");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
const initializePassport = require("./config/passport.config.js");
const passport = require("passport");

//LOGIN CON FACEBOOK

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(
  session({
    secret: "secretCoder",
    resave: false,
    saveUninitialized: false,
    // store: MongoStore.create({
    //   mongoUrl:
    //     "mongodb+srv://talonignacio07:coderhouse@cluster0.lfhc60v.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
    //   ttl: 100,
    // }),
  })
);

//Cambios passport:
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

//Session
//Renderizamos Login de usuario con session
app.get("/login", (req, res) => {
  // let usuario = req.query.usuario;
  // req.session.usuario = usuario;
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
    return res.send(
      `El usuario registrado es el siguiente: ${req.session.usuario}`
    );
  } else {
    res.send("No tenemos un usuario registrado");
  }
});

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
