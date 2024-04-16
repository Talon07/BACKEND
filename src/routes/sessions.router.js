const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const passport = require("passport");

//Login

router.post("/sessionlogin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await UserModel.findOne({ email: email });

    if (usuario) {
      //Aca metemos el login:
      if (usuario.password === process.env.DB_PASSWORD) {
        req.session.login = true;
        res
          .status(200)
          .send({ message: "Login correcto! Ma jes tuo seishon!" });
      } else {
        res.status(401).send({ error: "Contraseña no valida" });
      }
    } else {
      res.status(404).send({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(400).send({ error: "Error en el login, vamos a morir" });
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
