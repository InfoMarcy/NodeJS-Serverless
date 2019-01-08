const express = require("express");
const router = express.Router();

//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("db");
const auth = require("../middleware/auth");


const config = require('config');
const pathUrl = config.get('pathUrl');
const hostUrl = config.get('hostUrl'); 

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
            //Logs
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
            logger.info("Got a block User");

            var desbloquearUsuario = {
              host: hostUrl,
              port: 443,
              path: pathUrl + "/" + result[0].id + "/" + "unblock",
              method: "POST",
              headers: {
                "Private-Token": usuario.token,
                "Content-Type": "application/x-www-form-urlencoded"
              },
              rejectUnauthorized: false
            };

            validarJson.getJson(desbloquearUsuario, function(err, desbloquear) {
              if (err) {
                //Logs
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

              logger.info("El usuario ha sido desbloqueado: ", desbloquear);

              if (desbloquear) {
                logger.info({
                  cgSalida: "CI-121",
                  descSalida: "El Usuario ha sido desbloqueado"
                });

                return res.status(200).send({
                  cgSalida: "CI-121",
                  descSalida: "El Usuario ha sido desbloqueado"
                });
              } else if (!desbloquear) {
                //logs
                logger.info({
                  cgSalida: "CI-122",
                  descSalida: "Incidencia al desbloquear el Usuario"
                });

                return res.status(500).send({
                  cgSalida: "CI-122",
                  descSalida: "Incidencia al desbloquear el Usuario"
                });
              }
            });
          } else if (result[0].state === "active") {
            //Logs
            logger.info({
              cgSalida: "CI-123",
              descSalida: `El Usuario esta activo`
            });

            return res.status(202).send({
              cgSalida: "CI-123",
              descSalida: `El Usuario esta activo`
            });
          }
        });
      } else {
        return res.status(500).send({
          cgSalida: "CI-124",
          descSalida: "Incidencia al obtener el token"
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;
