const bcrypt = require("bcrypt");

const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//hashSync: toma el password que le pasamos y aplica el proceso de hasheo a partir de un "salt".

//Un "salt" es un string random que hace que el proceso de h aseho se realice de forma impredecible.

//genSaltSync(10): generar un salt de 10 caracteres.

const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);
//Compara los password, retorna true o false segun corresponda.

module.exports = {
  createHash,
  isValidPassword,
};
