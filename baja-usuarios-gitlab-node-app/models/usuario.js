const obtenerDatosFromFile = require("../middleware/obtenerDatosFromFile");
const cifradoJson = require("../middleware/cifradoJson");

module.exports = class Usuario {
  constructor(username, password, numEmpleado) {
    this.username = username;
    this.password = password;
    this.numEmpleado = numEmpleado;
  }

  // method to get all records from the class
  static getAll(cb) {
    obtenerDatosFromFile(cb, "usuarios.json");
  }

  static getAllIps(cb) {
    obtenerDatosFromFile(cb, "ips.json");
  }

  static getUsuariosBloqueadosPorIp(cb) {
    obtenerDatosFromFile(cb, "bloqueoIp.json");
  }

  static getUsuariosBloqueadosPorUsername(cb) {
    obtenerDatosFromFile(cb, "bloqueoUsuario.json");
  }

  static getNumIntentosPorIp(cb) {
    obtenerDatosFromFile(cb, "numIntentosIp.json");
  }

};