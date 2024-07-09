//Acá hacemos la conexión con MONGODB:

const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const { mongo_url } = configObject;

//Creamos una conexión con la base de datos

class BaseDatos {
  static #instancia;
  constructor() {
    mongoose.connect(mongo_url);
  }

  static getInstancia() {
    if (this.#instancia) {
      console.log("Conexion previa");
      return this.#instancia;
    }

    this.#instancia = new BaseDatos();
    console.log("Conexión exitosa!!");
    return this.#instancia;
  }
}

module.exports = BaseDatos.getInstancia();
