// used for working with objects
const _ = require("lodash");
//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("auth");
//Cifrado
const crypto = require("crypto-js");
// usuario model
const Usuario = require("../models/usuario");
const validaciones = require("../middleware/validaciones");
const jsonCRUDService = require("../service/numIntentosService");
const bloqueoUsuariosService = require("../service/bloqueoUsuariosService");
const bloqueoUsuariosServicePorUsername = require("../service/bloqueoUsuariosServicePorUsername");
const dateFormat = require("dateformat");
const now = new Date();

module.exports = function(req, res, next) {
  logger.info("La llamada viene de la Ip => ", {
    ip: req.connection.remoteAddress
  });

  // validate the body of the request
  const { error } = validaciones.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { ipError } = validaciones.validateIp(req.connection.remoteAddress);
  if (ipError) return res.status(400).send(ipError.details[0].message);

  // get usuario por Ip
  let usuarioBloqueadoPorIp = bloqueoUsuariosService.getByIp(
    req.connection.remoteAddress
  );
  logger.info("usuario bloqueado por Ip => ", usuarioBloqueadoPorIp);

  // get usuario bloqueado por username
  let usuarioBloqueadoPorUsername = bloqueoUsuariosServicePorUsername.getByUsername(
    req.body.username
  );
  logger.info(
    "Usuario bloqueado por username => ",
    usuarioBloqueadoPorUsername
  );

  if (usuarioBloqueadoPorIp !== 0 || usuarioBloqueadoPorUsername !== 0) {
    if (
      validaciones.validateFechaBloqueo(usuarioBloqueadoPorIp.fecha_bloqueo) &&
      usuarioBloqueadoPorIp !== 0
    ) {
      // desbloquear Usuario por Ip
      bloqueoUsuariosService.delete(req.connection.remoteAddress);
    }

    if (
      validaciones.validateFechaBloqueo(
        usuarioBloqueadoPorUsername.fecha_bloqueo
      ) &&
      usuarioBloqueadoPorUsername !== 0
    ) {
      // desbloquear Usuario
      bloqueoUsuariosServicePorUsername.deleteByUsername(req.body.username);
    }

    // get usuario por Ip
    usuarioBloqueadoPorIp = 0;
    usuarioBloqueadoPorIp = bloqueoUsuariosService.getByIp(
      req.connection.remoteAddress
    );

    // get usuario por username
    usuarioBloqueadoPorUsername = 0;
    usuarioBloqueadoPorUsername = bloqueoUsuariosServicePorUsername.getByUsername(
      req.body.username
    );

    if (usuarioBloqueadoPorIp !== 0 || usuarioBloqueadoPorUsername !== 0) {
      //check if the ip is blocked
      if (
        usuarioBloqueadoPorIp.ip !== 0 ||
        usuarioBloqueadoPorUsername.username !== 0
      ) {
        logger.info({
          cgSalida: "CI-126",
          descSalida: "No estas autorizado para consumir este recurso"
        });
        return res.status(403).send({
          cgSalida: "CI-126",
          descSalida: "No estas autorizado para consumir este recurso"
        });
      }
    }
  }

  Usuario.getAllIps(ips => {
    try {
      //find usuario by username
      let ipWhiteList =
        ips.filter(function(r) {
          return r["ip"] == req.connection.remoteAddress;
        })[0] || null;

      if (!ipWhiteList) {
        logger.info({
          cgSalida: "CI-126",
          descSalida: "No estas autorizado para consumir este recurso"
        });
        return res.status(403).send({
          cgSalida: "CI-126",
          descSalida: "No estas autorizado para consumir este recurso"
        });
      } else {
        Usuario.getAll(usuarios => {
          try {
            // validar el num de intentos
            let numIntentosIp = jsonCRUDService.getByIp(
              req.connection.remoteAddress
            );

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

              logger.info(
                "============================================== usuario no valido =============================================="
              );
              if (numIntentosIp > 0) {
                jsonCRUDService.update(req.connection.remoteAddress, {
                  numIntentos: numIntentosIp + 1,
                  username: req.body.username,
                  date: dateFormat(now, "yyyy-mm-dd HH:MM:ss"),
                  ip: req.connection.remoteAddress
                });

                // bloquear ip cada 10 intentos fallidos
                if ((numIntentosIp + 1) % 10 === 0) {
                  let ipUsuarioBloqueado = bloqueoUsuariosService.getByIp(
                    req.connection.remoteAddress
                  );

                  if (ipUsuarioBloqueado === 0) {
                    bloqueoUsuariosService.create({
                      usuario: req.body.username,
                      bloqueado: true,
                      fecha_bloqueo: dateFormat(now, "yyyy-mm-dd HH:MM:ss"),
                      ip: req.connection.remoteAddress
                    });
                  }
                }

                // bloquear usuario cada 5 intentos fallidos por username
                if ((numIntentosIp + 1) % 5 === 0) {
                  // obtener usuario from bloqueo usuario.json
                  let usuarioBloqueadoPorUsername = bloqueoUsuariosServicePorUsername.getByUsername(
                    req.body.username
                  );

                  // verificar que hay usuarios en los recursos
                  if (usuarioBloqueadoPorUsername === 0) {
                    bloqueoUsuariosServicePorUsername.create({
                      usuario: req.body.username,
                      bloqueado: true,
                      fecha_bloqueo: dateFormat(now, "yyyy-mm-dd HH:MM:ss"),
                      ip: req.connection.remoteAddress
                    });
                  }
                }
              } else if (numIntentosIp === 0) {
                jsonCRUDService.create({
                  numIntentos: 1,
                  date: dateFormat(now, "yyyy-mm-dd HH:MM:ss"),
                  username: req.body.username,
                  ip: req.connection.remoteAddress
                });
              }

              return res.status(404).send({
                cgSalida: "CI-104",
                descSalida:
                  "Error de autenticación, (El usuario y/o contraseña son incorrectos)"
              });
            }

            // valida que la fecha de expiracion de la contraseña no exceda los 90 dias
            if (validaciones.validateDate(usuario.date)) {
              return res.status(400).send({
                cgSalida: "CI-104",
                descSalida:
                  "Error de autenticación, (El usuario y/o contraseña son incorrectos)"
              });
            }

            // validate the password against the json file
            const validPassword = validaciones.validatePassword(
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

              logger.info(
                "============================================== before !validPassword =============================================="
              );
              if (numIntentosIp > 0) {
                jsonCRUDService.update(req.connection.remoteAddress, {
                  numIntentos: numIntentosIp + 1,
                  username: req.body.username,
                  date: dateFormat(now, "yyyy-mm-dd HH:MM:ss"),
                  ip: req.connection.remoteAddress
                });

                // bloquear ip cada 10 intentos fallidos
                if ((numIntentosIp + 1) % 10 === 0) {
                  let ipUsuarioBloqueado = bloqueoUsuariosService.getByIp(
                    req.connection.remoteAddress
                  );

                  if (ipUsuarioBloqueado === 0) {
                    bloqueoUsuariosService.create({
                      usuario: req.body.username,
                      bloqueado: true,
                      fecha_bloqueo: dateFormat(now, "yyyy-mm-dd HH:MM:ss"),
                      ip: req.connection.remoteAddress
                    });
                  }
                }

                // bloquear usuario cada 5 intentos fallidos por username
                if ((numIntentosIp + 1) % 5 === 0) {
                  // obtener usuario from bloqueo usuario.json
                  let usuarioBloqueadoPorUsername = bloqueoUsuariosServicePorUsername.getByUsername(
                    req.body.username
                  );

                  // verificar que hay usuarios en los recursos
                  if (usuarioBloqueadoPorUsername === 0) {
                    bloqueoUsuariosServicePorUsername.create({
                      usuario: req.body.username,
                      bloqueado: true,
                      fecha_bloqueo: dateFormat(now, "yyyy-mm-dd HH:MM:ss"),
                      ip: req.connection.remoteAddress
                    });
                  }
                }
              } else if (numIntentosIp === 0) {
                jsonCRUDService.create({
                  numIntentos: 1,
                  date: dateFormat(now, "yyyy-mm-dd HH:MM:ss"),
                  username: req.body.username,
                  ip: req.connection.remoteAddress
                });
              }

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
                "Error de autenticación, no se pudo autenticar al usuario porque no se pudo obtener el recurso deseado"
            });
          }
        });
      }
    } catch (ex) {
      res.status(500).send({
        cgSalida: "CI-112",
        descSalida:
          "Error de autenticación, no se pudo autenticar al usuario porque no se pudo obtener el recurso deseado"
      });
    }
  });
};
