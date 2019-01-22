// usuario model
const Oauth2Code = require("../model/userModel");
const validarJson = require("../middleware/validarJson");
const writeDataToJsonFile = require("../middleware/writeDataToJsonFile");
//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("oAuth2CodeRepository");

// usuarios Object
let usuarios = [];

Oauth2Code.getAllOauth2Codes(obj => {
  if (!validarJson.isEmptyObject(obj)) {
    usuarios = obj;
  }
});

module.exports = {
  // create a record
  create: function(obj) {
    usuarios.push(obj);

    if (usuarios.length != 0) {
      writeDataToJsonFile(usuarios, "oauth2Clientes.json");
      logger.info("Datos gardados exitosamente");
      //return obj;
      return true;
    } else {
      logger.info("Error al guardar los datos");
      return false;
    }
  },

  getByCode: function(code) {
    var filteredByUserId = [];

    if (!validarJson.isEmptyObject(usuarios)) {
      for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].value === code) {
          filteredByUserId.push(usuarios[i]);
        }
      }

      if (!validarJson.isEmptyObject(filteredByUserId)) {
        if (filteredByUserId.length != 0) {
          return filteredByUserId[0];
        } else {
          logger.info("Error al tratar de obtener los datos por email");
          return 0;
        }
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  },



};
