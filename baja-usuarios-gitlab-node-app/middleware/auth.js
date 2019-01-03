// used for working with objects
const _ = require("lodash");
const Joi = require("joi");
//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("auth");
//Cifrado
const crypto = require("crypto-js");
// usuario model
const Usuario = require("../models/usuario");

module.exports = function(req, res, next) {
  logger.info({ ip1: req.connection.remoteAddress });

  // validate the body of the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  Usuario.getAll(usuarios => {
    try {
      //find usuario by username
      let usuario =
        usuarios.filter(function(r) {
          return r["username"] == req.body.username;
        })[0] || null;

      //validate if the usuario exist
      if (!usuario) {
        logger.info({
          cgSalida: "CI-104",
          descSalida:
            "Error de autenticación, (El usuario y/o contraseña son incorrectos)"
        });
        return res.status(404).send({
          cgSalida: "CI-104",
          descSalida:
            "Error de autenticación, (El usuario y/o contraseña son incorrectos)"
        });
      }

      // validate the password against the json file
      const validPassword = validatePassword(
        usuario.password,
        crypto.SHA256(req.body.password).toString()
      );

      logger.info({ "Contraseña valida: ": validPassword });

      // validate if the email exist
      if (!validPassword) {
        logger.info({
          cgSalida: "CI-104",
          descSalida:
            "Error de autenticación, (El usuario y/o contraseña son incorrectos)"
        });

        return res.status(400).send({
          cgSalida: "CI-104",
          descSalida:
            "Error de autenticación, (El usuario y/o contraseña son incorrectos)"
        });
      }
      next();
    } catch (ex) {
      res.status(500).send({
        cgSalida: "CI-112",
        descSalida:
          "Error de autenticación, no se pudo autenticar al usuario porque no se pudo obtener la contraseña de la base de datos de usuarios"
      });
    }
  });
};

//valida la contraseña contra el hash
function validatePassword(pass1, pass2) {
  if (pass1.toString().trim() === pass2.toString().trim()) {
    return true;
  } else {
    return false;
  }
}

function validate(req) {
  const schema = {
    numEmpleado: Joi.number()
      .integer()
      .required(),
    password: Joi.string()
      .min(10)
      .max(50)
      .required(),
    username: Joi.string()
      .min(3)
      .max(20)
      .required()
  };

  return Joi.validate(req, schema);
}
