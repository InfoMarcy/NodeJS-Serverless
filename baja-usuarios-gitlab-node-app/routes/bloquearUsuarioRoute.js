const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");


const config = require('config');
const pathUrl = config.get('pathUrl');
const hostUrl = config.get('hostUrl'); 

//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("obtenerGitUser");

// usuario model
const Usuario = require("../models/usuario");
const validarJson = require('../middleware/validarJson');
// Get an item By ID from the database
router.post("/", auth, async (req, res) => {
  Usuario.getAll(usuarios => {
    try {
      //find usuario by username
      let usuario =
        usuarios.filter(function(r) {
          return r["username"] == req.body.username;
        })[0] || null;

      if (usuario) {
        var obtenerUsuarioGit = {
          host: hostUrl,
          port: 443,
          path: pathUrl + "?username=" + req.body.numEmpleado,
          method: "GET",
          headers: {
            "Private-Token": usuario.token
          },
          rejectUnauthorized: false
        };

        validarJson.getJson(obtenerUsuarioGit, function(err, result) {
          if (err) {
            logger.info(
              {
                cgSalida: "CI-120",
                descSalida: "Incidencia al conectarse con el servidor"
              },
              err
            );

            return res.status(500).send({
              cgSalida: "CI-120",
              descSalida: "Incidencia al conectarse con el servidor"
            });
          }

          if (validarJson.isEmptyObject(result)) {
            //logs
            logger.info({
              cgSalida: "CI-103",
              descSalida: "No existe usuario en el sistema"
            });

            return res.status(404).send({
              cgSalida: "CI-103",
              descSalida: "No existe usuario en el sistema"
            });
          } else if (result[0].state === "blocked") {
            //logs
            logger.info({
              cgSalida: "CI-102",
              descSalida: "El usuario ya se encontraba dado de baja"
            });

            return res.status(202).send({
              cgSalida: "CI-102",
              descSalida: "El usuario ya se encontraba dado de baja"
            });
          } else if (result[0].id !== null) {
            var bloquearUsuario = {
              host: hostUrl,
              port: 443,
              path: pathUrl + "/" + result[0].id + "/block",
              method: "POST",
              headers: {
                "Private-Token": usuario.token
              },
              rejectUnauthorized: false
            };

            validarJson.getJson(bloquearUsuario, function(err, blockUser) {
              if (err) {
                //logs
                logger.info(
                  {
                    cgSalida: "CI-120",
                    descSalida: "Incidencia al conectarse con el servidor"
                  },
                  err
                );

                return res.status(500).send({
                  cgSalida: "CI-120",
                  descSalida: "Incidencia al conectarse con el servidor"
                });
              }

              logger.info("El usuario ha sido bloqueado: ", blockUser, {
                cgSalida: "CI-101",
                descSalida: "Baja aplicada exitosamente"
              });

              if (blockUser) {
                logger.info({
                  cgSalida: "CI-101",
                  descSalida: "Baja aplicada exitosamente"
                });

                return res.status(200).send({
                  cgSalida: "CI-101",
                  descSalida: "Baja aplicada exitosamente"
                });
              } else if (!blockUser) {
                //logs
                logger.info({
                  cgSalida: "CI-120",
                  descSalida: "Incidencia al realizar la operacion"
                });

                return res.status(500).send({
                  cgSalida: "CI-120",
                  descSalida: "Incidencia al realizar la operacion"
                });
              }
            });
          } else if (result[0].id === null) {
            //logs
            logger.info({
              cgSalida: "CI-103",
              descSalida: "No existe usuario en el sistema"
            });

            return res.status(404).send({
              cgSalida: "CI-103",
              descSalida: "No existe usuario en el sistema"
            });
          }
        });
      } else {
        return res.status(500).send({
          cgSalida: "CI-120",
          descSalida: "Incidencia al obtener el token"
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;
