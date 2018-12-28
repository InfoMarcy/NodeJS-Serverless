const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const usuarioSchema = new mongoose.Schema({
  username: { 
     type: String,
     required: true,
     trim: true, 
     minlength: 3,
     maxlength: 50
  },

  password: { 
    type: String, 
    required: true,
    minlength: 8,
    maxlength: 1024
  },

  numEmpleado: {
    type: String,
    required: true,
    unique: true,
    maxlength: 10
}

});
// create a method for getting the json token
usuarioSchema.methods.generateAuthToken = function() {
 return jwt.sign({ _id: this._id}, config.get('private_token')); 
};


const Usuario = mongoose.model('Usuario', usuarioSchema);

function validarUsuario(usuario) {
  const schema = {
    username: Joi.string().min(3).max(50).required(),
    numEmpleado: Joi.string().min(3).max(10).required(),
    password: Joi.string().min(5).max(1024).required()
  };

  return Joi.validate(usuario, schema);
}


exports.Usuario = Usuario;
exports.validarUsuario = validarUsuario;