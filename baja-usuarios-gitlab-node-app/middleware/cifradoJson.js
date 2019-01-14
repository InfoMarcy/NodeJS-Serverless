///===============================
const shell = require("shelljs");
const getRuta = require("../middleware/getRuta");

//archivo cifrado que se va a generear a partir del archivo original
var Archivo_Cifrado = getRuta.getRuta("db", "usuarios.json");

//archivo original en texto plano
var Archivo_Original = getRuta.getRuta("db", "ips.json");

module.exports = {
  //funcion para descifrar el archivo
  Decrypt_File: function() {
    return shell.exec(
      getRuta("middleware", "desencriptar.sh ") + Archivo_Cifrado
    );
  },

  Encrypt_File: function() {
    return shell.exec(
      getRuta("middleware", "encriptar.sh ") + Archivo_Original
    );
  }
};
