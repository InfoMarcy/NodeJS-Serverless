const https = require("https");
const express = require("express");
const router = express.Router();

const pathUrl = "/api/v4/users";
const hostUrl = "";
const gitToken = "";

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
        console.log("Error while trying to get the git user", err);
        return res
          .status(500)
          .send({ cgSalida: "CI-105", descSalida: "Incidencia al conectarse con el servidor" });
    }
    
    console.log("obtenerUsuarioGit"); 
    console.log(usuario); 

    if (isEmptyObject(usuario)) {
        return res
        .status(404)
        .send({ cgSalida: "CI-103", descSalida: "El Usuario o la contraseña son invalidos"});

      } else if(usuario[0].state === 'blocked'){
          console.log("Got a block User");

                                        var desbloquearUsuario = {
                                            host: hostUrl,
                                            port: 443,
                                            path: pathUrl + "/"+ usuario[0].id + + "/" + "unblock",
                                            method: "POST",
                                            headers: {
                                            "Private-Token": gitToken
                                            },
                                            rejectUnauthorized: false
                                        };

                                        getJson(desbloquearUsuario, function(err, result) {
                                            if (err) {
                                                console.log("Error while trying to get the git user", err);
                                                return res
                                                  .status(500)
                                                  .send({ cgSalida: "CI-105", descSalida: "Incidencia al conectarse con el servidor" });
                                            };

                                            if (isEmptyObject(result)) {
                                            return res
                                            .status(404)
                                            .send({ cgSalida: "CI-103", descSalida: "El Usuario o la contraseña son invalidos"});
                                            }  else {
                                           
                                            return res
                                            .status(200)
                                            .send({cgSalida: "CI-102", descSalida: `El Usuario ha sido desbloqueado`});
                                            }

                                        });
                                                
                                            }  else if(usuario[0].state === 'active'){
                                                return res
                                                .status(200)
                                                .send({cgSalida: "CI-102", descSalida: `El Usuario esta activo`});
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
