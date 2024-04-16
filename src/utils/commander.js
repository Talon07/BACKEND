const { Command } = require("commander");

const program = new Command();

//IMPORTANTE -1: Comando, -2: La descripcion , -3: Valor por default

program.option("--mode <mode>", "modo de trabajo", "produccion");
program.parse();

module.exports = program;
