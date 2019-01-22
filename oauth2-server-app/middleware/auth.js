const validaciones = require("./validaciones");

const oauth2UserRepository = require("../repository/oauth2UserRepository");
const crypto = require("crypto-js");

module.exports = function(req, res, next) {
  // validate the body of the request
  const cred = {
    "email": req.body.email,
    "password": req.body.password
  };

  const { error } = validaciones.validarLogin(cred);
  if (error) return res.status(400).send(error.details[0].message);

  // get the user from the json file by email
  let oauth2User = oauth2UserRepository.getByEmail(req.body.email);

  if (oauth2User) {
    if (
      validaciones.validatePassword(
        crypto.SHA256(req.body.password),
        oauth2User.password
      )
    ) {
      console.log("El Usuario ha sido autenticado exitosamente");
      res.locals.userId = oauth2User.userId;
      next();
    } else {
      res.status(400).send({
        success: false,
        mensaje: "Usuario o contraseña incorrectas"
      });
    }
  } else {
    res.status(400).send({
      success: false,
      mensaje: "Usuario o conrasteña incorrectas"
    });
  }
};
