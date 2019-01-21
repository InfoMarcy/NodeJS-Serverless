const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const hashPassword = require("../../middleware/hashPassword");
//Cifrado
const crypto = require("crypto-js");
const Joi = require('joi');

const OAuthUsersSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5,
    maxlength: 50
  },

  hashed_password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  password_reset_token: { type: String, unique: true, default : new mongoose.Types.ObjectId()},
  reset_token_expires: Date,
  nombre: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },

  apellidoPaterno: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  apellidoMaterno: {
    type: String,
    required: false,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  date: {
    type: String,
    default: Date.now
  }
});

OAuthUsersSchema.static("register", function(fields, cb) {
  let user = [];

  fields.hashed_password = hashPassword.hashPassword(fields.password).toString();
  delete fields.password;

  user = new OAuthUsersModel(fields);
  user.save(cb);
});

OAuthUsersSchema.static("getUser", function(email, password, cb) {

  OAuthUsersModel.authenticate(email, password, function(err, user) {
    if (err || !user) return cb(err);
    cb(null, user.email);
  });
});

OAuthUsersSchema.static("authenticate", function(email, password, cb) {

  this.findOne({ email: email }, function(err, user) {
    if (err || !user) return cb(err);
    // validate the password against the json file
    const validPassword = hashPassword.validatePassword(
      user.hashed_password,
      crypto.SHA256(password).toString()
    );
    cb(null, validPassword ? user : null);
  });
});


mongoose.model("oAuth_Users", OAuthUsersSchema);
const OAuthUsersModel = mongoose.model("oAuth_Users");

// validate Customer
function validateOAuthUser(usuario){
  // if invalid 400  - Bad Request // joi input validation
 const schema = {
  email: Joi.string().min(3).max(50).email(),
  password: Joi.string().min(10).max(1024),
  nombre:Joi.string().min(3).max(50),
  apellidoPaterno:Joi.string().min(3).max(50),
  apellidoMaterno:Joi.string().min(3).max(50),
 };
 return Joi.validate(usuario, schema);
};


exports.validateUser = validateOAuthUser;
exports = OAuthUsersModel;


