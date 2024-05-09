const express = require("express");
const router = express.Router();
const logger = require("../utils/logger.js");

router.get("/loggerTest", (req, res) => {
  req.logger.fatal("La Aplicacion no funciona");
  req.logger.error("Error en la aplicacion");
  req.logger.warning("Cuidado! hombre radiactivo!");
  req.logger.info("Estamos navegando la app");
  req.logger.http("Error al procesar la solicitud");
  req.logger.debug("Depuracion activa");

  res.send("Logs generados!");
});

module.exports = router;
