const obtenerDatosFromFile = require("../middleware/obtenerDatosFromFile");

module.exports = class Oauth2Usuarios {
  // get all registered users
  static getAllOauth2Usuarios(cb) {
    obtenerDatosFromFile(cb, "oauth2Usuarios.json");
  }

  // get all registered Client Apps
  static getAllOauth2Clientes(cb) {
    obtenerDatosFromFile(cb, "oauth2Clientes.json");
  }

  // get all tokens
  static getAllOauth2Tokens(cb) {
    obtenerDatosFromFile(cb, "oauth2Tokens.json");
  }

  // get all tokens
  static getAllOauth2Codes(cb) {
    obtenerDatosFromFile(cb, "oauth2Codes.json");
  }
};
