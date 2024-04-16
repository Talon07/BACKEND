//Acá hacemos la conexión con MONGODB:

const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const { mongo_url } = configObject;

//Creamos una conexión con la base de datos

mongoose
  .connect(mongo_url)
  .then(() => console.log("Conexion exitosa"))
  .catch(() => console.log("Error en la conexion"));
