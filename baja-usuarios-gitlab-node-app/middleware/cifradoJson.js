///===============================
const shell = require("shelljs");
const FS = require("fs");
const path = require("path");
//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("cifradoJson");

//archivo original en texto plano
var Archivo_Original = getRuta("db", "usuarios.json");

//archivo cifrado que se va a generear a partir del archivo original
var Archivo_Cifrado = getRuta("middleware", "usuariosEncritados.json");

//archivo en teto plano que se va a generar a partir del archivo cifrado
var Archivo_Descifrado = getRuta("middleware", "usuariosDescifrado.json");

var exec = require("child_process").exec;

// get the path of the json file that we are going to user

function getRuta(carpeta, ruta) {
  const p = path.join(path.dirname(process.mainModule.filename), carpeta, ruta);

  return p;
}

module.exports = {
  //funcion para descifrar el archivo
  Decrypt_File: function() {
    var datos = shell.exec(
      getRuta("middleware", "desencriptar.sh ") + Archivo_Cifrado
    );

    return datos;
  }
};


