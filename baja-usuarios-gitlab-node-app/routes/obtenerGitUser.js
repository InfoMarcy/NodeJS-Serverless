const https = require("https");
const express = require("express");
const router = express.Router();

const pathUrl = "/api/v4/users";
const hostUrl = "";
const gitToken = "";

//working with log files
const log4js = require('log4js');
const logger = log4js.getLogger("obtenerGitUser");

// Get an item By ID from the database
router.get("/:username", async (req, res) => {
  var obtenerUsuarioGit = {
    host: hostUrl,
    port: 443,
    path: pathUrl + "?username=" + req.params.username,
    method: "GET",
    headers: {
      "Private-Token": gitToken
    },
    rejectUnauthorized: false
  };

  getJson(obtenerUsuarioGit, function(err, usuario) {
    if (err) {
      logger.info("CI-105 - Incidencia al conectarse con el servidor", err);

      return res
        .status(500)
        .send({ cgSalida: "CI-105", descSalida: "Incidencia al conectarse con el servidor" });
    }


    if (isEmptyObject(usuario)) {
      //logs
      logger.info({ cgSalida: "CI-103", descSalida: "El Usuario o la contraseña son invalidos"});

        return res
        .status(404)
        .send({ cgSalida: "CI-103", descSalida: "El Usuario o la contraseña son invalidos"});

      } else if(usuario[0].state === 'blocked'){
        //logs
      logger.info({ cgSalida: "CI-102", descSalida: "El Usuario ya esta bloqueado"});

        return res
        .status(200)
        .send({ cgSalida: "CI-102", descSalida: "El Usuario ya esta bloqueado"});

     } else if((usuario[0].id !== null)) {

      var bloquearUsuario = {
        host: hostUrl,
        port: 443,
        path: pathUrl + "/"+ usuario[0].id + "/block",
        method: "POST",
        headers: {
          "Private-Token": gitToken
        },
        rejectUnauthorized: false
      };

      getJson(bloquearUsuario, function(err, result) {
        if (err) {
      //logs
      logger.info("CI-105 - Incidencia al conectarse con el servidor", err);


      return res
        .status(500)
        .send({ cgSalida: "CI-105", descSalida: "Incidencia al conectarse con el servidor" });

        };

        logger.info("El usuario ha sido bloqueado: ", result);

        if (result) {

          logger.info({ cgSalida: "CI-106", descSalida: "El Usuario ha sido bloqueado"});

          return res
          .status(200)
          .send({ cgSalida: "CI-106", descSalida: "El Usuario ha sido bloqueado"});

        }  else  if(!result){
          //logs
          logger.info({ cgSalida: "CI-103", descSalida: "Incidencia al bloquear el Usuario"});

          return res
          .status(404)
          .send({ cgSalida: "CI-103", descSalida: "Incidencia al bloquear el Usuario"});
        }

      });

     } else if((usuario[0].id === null)) {

       //logs
       logger.info({ cgSalida: "CI-103", descSalida: "El Usuario o la contraseña son invalidos"});

      return res
        .status(404)
        .send({ cgSalida: "CI-103", descSalida: "El Usuario o la contraseña son invalidos"});
     }  
  });
});

function getJson(options, cb) {
  https
    .request(options, function(res) {
      var body = "";

      res.on("data", function(getData) {
        body += getData;
      });

      res.on("end", function() {
        let usuario = JSON.parse(body);
        cb(null, usuario);
      });
      res.on("error", cb);
    })
    .on("error", cb)
    .end();
}
// Verify that the return json is not empty
function isEmptyObject(obj) {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  }
module.exports = router;
