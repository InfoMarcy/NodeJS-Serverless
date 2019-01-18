const Joi = require("joi");
const mongoose = require("mongoose");


const usuarioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  date: {
    type: String,
    default: Date.now
  }
});

const User = mongoose.model("Usuarios_Locales", usuarioSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    email: Joi.string()
      .min(3)
      .max(50)
      .required()
      .email(),
    password: Joi.string()
      .min(3)
      .max(1024)
      .required()
  };

  return Joi.validate(user, schema);
}
exports.LocalUser = User;
exports.validateLocalUser = validateUser;
