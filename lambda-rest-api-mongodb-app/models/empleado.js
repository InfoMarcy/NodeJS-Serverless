const mongoose = require('mongoose');
const Joi = require('joi');


const empleadoSchema = new mongoose.Schema({  
	  username:String,
	  nombre:String,
	  apellido:String,
	  email:String,
	  telefono:String,
      ocupacion:String
});

function validateEmpleado(empleado) {
	const schema = {
		username: Joi.string().min(5).max(50).required(),
		nombre: Joi.string().min(3).max(50).required(),
		apellido: Joi.string().min(3).max(50).required(),
	    email: Joi.string().min(5).max(50).required().email(),
		telefono: Joi.string().min(10).max(14).required(),
		ocupacion: Joi.string().min(3).max(50).required()
	};
  
	return Joi.validate(empleado, schema);
  }

//Models class
exports.Empleado = mongoose.model('Empleado', empleadoSchema);
exports.validateEmpleado = validateEmpleado;
