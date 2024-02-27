//Acá hacemos la conexión con MONGODB:

const mongoose = require("mongoose");

//Creamos una conexión con la base de datos

mongoose
  .connect(
    "mongodb+srv://talonignacio07:coderhouse@cluster0.lfhc60v.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Conexion exitosa"))
  .catch(() => console.log("Error en la conexion"));
