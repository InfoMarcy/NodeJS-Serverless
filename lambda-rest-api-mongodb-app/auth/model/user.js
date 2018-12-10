const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  name: { 
     type: String,
     required: true,
     trim: true, 
     minlength: 5,
     maxlength: 50,
     uppercase: true

  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, 
    minlength: 5,
    maxlength: 50,
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
});


// create a method for getting the json token
userSchema.methods.generateAuthToken = function() {
 return jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey')); 
};

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(5).max(1024).required()
  };

  return Joi.validate(user, schema);
}


exports.User = mongoose.model('User', userSchema);
exports.validate = validateUser;
