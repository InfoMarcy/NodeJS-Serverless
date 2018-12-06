const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({  
	  username:String,
	  nombre:String,
	  apellido:String,
	  email:String,
	  telefono:String,
      ocupacion:String
});


//Models class
const User = mongoose.model('User', userSchema);

exports.User = User;
exports.userSchema = userSchema;
