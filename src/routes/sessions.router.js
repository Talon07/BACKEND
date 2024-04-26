const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const passport = require("passport");
const generateToken = require("../utils/jsonwebtoken.js");
const { isValidPassword } = require("../utils/hashbcrypt.js");

//Login con JSON Web Token

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await UserModel.findOne({ email: email });

    if (!usuario) {
      return res.status(400).send({ message: "Ese usuario no existe." });
    }

    if (!isValidPassword(password, usuario)) {
      return res.status(401).send({ message: "Credenciales inválidas." });
    }

    // Si el usuario existe y la contraseña es correcta, establecemos req.session.usuario
    req.session.usuario = {
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      email: usuario.email,
      id: usuario._id,
    };

    // Redirigimos al usuario a la ruta "/products" después de iniciar sesión correctamente.
    res.redirect("/products");
  } catch (error) {
    console.log("Error en autenticación ", error);
    res
      .status(500)
      .send({ status: "error", message: "Error interno del servidor" });
  }
});

//Logout

router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
    res.redirect("/login");
  }
  res.status(200).send({ message: "Login eliminado" });
});

//VERSION PARA GITHUB:
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    //La estrategia de github me va a retornar el usuario, entonces lo agregamos a nuestra session
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
  }
);

module.exports = router;
