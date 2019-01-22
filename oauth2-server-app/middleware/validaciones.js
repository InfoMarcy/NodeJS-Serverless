const Joi = require('joi');
//Cifrado
const crypto = require("crypto-js");

module.exports = {
    // validate the OAuthUser Input
 validarOauthUser: function (usuario){
  // if invalid 400  - Bad Request // joi input validation
 const schema = {
  email: Joi.string().min(3).max(50).required().email(),
  password: Joi.string().min(10).max(1024).required(),
  nombre:Joi.string().min(3).max(50).required(),
  apellidoPaterno:Joi.string().min(3).max(50).required(),
  apellidoMaterno:Joi.string().min(3).max(50),
 };
 return Joi.validate(usuario, schema);
},

validarLogin: function (credentials){
    const schema = {
        email: Joi.string().min(3).max(50).required().email(),
        password: Joi.string().min(10).max(1024).required(),
       };
       return Joi.validate(credentials, schema);
},
  //valida la contraseña contra el hash
  hashPassword: function(pass) {
    return crypto.SHA256(pass).toString();
  },

  validarCliente: function (cliente){

    delete cliente.password;
    delete cliente.email;

    const schema = {
        appName: Joi.string().min(3).max(50).required(),
        redirectUri: Joi.string().min(3).max(50).required(),
        appUri: Joi.string().min(3).max(50).required(),
        appDescription: Joi.string().min(10).max(1024).required(),
       };
       return Joi.validate(cliente, schema);
},
  //valida la contraseña contra el hash
  hashPassword: function(pass) {
    return crypto.SHA256(pass).toString();
  },

  validatePassword: function(pass1, pass2) {
    if (pass1.toString().trim() === pass2.toString().trim()) {
      return true;
    } else {
      return false;
    }
  },
}


