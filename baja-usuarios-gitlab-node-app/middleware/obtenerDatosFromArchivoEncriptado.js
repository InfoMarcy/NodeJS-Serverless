const cifradoJson = require("../middleware/cifradoJson");
const validarJson = require("../middleware/validarJson");
//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("obtenerDatosFromArchivoEncriptado");

module.exports = function(cb) {
  let fileContent = cifradoJson.Decrypt_File();
  let jsonDatos = JSON.parse(fileContent);

  logger.info("jsonDatos => ", jsonDatos);

  if (validarJson.isEmptyObject(jsonDatos)) {
    return cb([]);
  } else {
    cb(JSON.parse(fileContent));
  }
};
