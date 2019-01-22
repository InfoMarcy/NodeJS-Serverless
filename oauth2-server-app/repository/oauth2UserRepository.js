// usuario model
const Oauth2Usuarios = require("../model/userModel");
const validarJson = require("../middleware/validarJson");
const writeDataToJsonFile = require("../middleware/writeDataToJsonFile");
//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("oAuth2UsuarioRepository");

// usuarios Object
let usuarios = [];

Oauth2Usuarios.getAllOauth2Usuarios(obj => {
  if (!validarJson.isEmptyObject(obj)) {
    usuarios = obj;
  }
});

module.exports = {
  // create a record
  create: function(obj) {
    usuarios.push(obj);

    if (usuarios.length != 0) {
      writeDataToJsonFile(usuarios, "oauth2Usuarios.json");
      logger.info("Datos gardados exitosamente");
      //return obj;
      return;
    } else {
      logger.info("Error al guardar los datos");
      return;
    }
  },

  getByEmail: function(email) {
    var filteredByEmail = [];

    if (!validarJson.isEmptyObject(usuarios)) {
      for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].email === email) {
          filteredByEmail.push(usuarios[i]);
        }
      }

      if (!validarJson.isEmptyObject(filteredByEmail)) {
        if (filteredByEmail.length != 0) {
          return filteredByEmail[0];
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
  }
};
