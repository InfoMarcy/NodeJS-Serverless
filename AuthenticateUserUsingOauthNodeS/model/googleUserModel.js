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
  },
  date: {
    type: String,
    default: Date.now
  }
});

const User = mongoose.model('Usuarios_Google', userSchema);
exports.GoogleUser = User; 