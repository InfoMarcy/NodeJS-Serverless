const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
     type: String,
     required: true,
     trim: true, 
     minlength: 3,
     maxlength: 50
  },
  googleId: {
    type: String,
    required: true,
    unique: true,
    trim: true, 
    minlength: 5,
    maxlength: 50
  }
});


const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    username: Joi.string().min(3).max(50).required(),
    googleId: Joi.string().min(3).max(50).required()
  };

  return Joi.validate(user, schema);
}
exports.User = User; 
exports.validate = validateUser;