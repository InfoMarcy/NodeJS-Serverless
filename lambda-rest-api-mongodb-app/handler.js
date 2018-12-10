"use strict";
const mongoose = require('mongoose');
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
//connect to the database
const { Empleado, validateEmpleado } = require("./models/empleado");
require("./db")();

// function to response to the client
function createResponse(statusCode, message) {
  return {
    statusCode: statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
  };
}

// function which create a new record
module.exports.create = async event => {
  // validate Input with Joi
  const { error } = validateEmpleado(event.body);
  if (error) {
    return createResponse(400, error.details[0].message);
  }

  // if no errors continue
  let empleado = new Empleado(JSON.parse(event.body));
  empleado = await empleado.save();
  return createResponse(201, empleado);
};

// get a record from the database
module.exports.getOne = async event => {
  // validate Input Id with Joi
  if(!mongoose.Types.ObjectId.isValid(event.pathParameters.id)){
    return createResponse(400, 'Invalid Id');
  }

  const empleado = await Empleado.findById(event.pathParameters.id);
  // if there is no record return 404 error
  if (!empleado) {
    return createResponse(
      404,
      "El Usuario con el id proporcionado no se ha encontrado"
    );
  } else {
    return createResponse(200, empleado);
  }
};

// get a list of empleados
module.exports.getAll = async event => {
  const empleados = await Empleado.find().sort("nombre");

  if (!empleados) {
    return createResponse(
      404,
      "No hay usarios disponible por el momento, gracias!!!"
    );
  }
  return createResponse(200, empleados);
};

// update a record in the db
module.exports.update = async event => {
  // validate Input Id with Joi
  if(!mongoose.Types.ObjectId.isValid(event.pathParameters.id)){
    return createResponse(400, 'Invalid Id');
  }

  // validate Input with Joi
   error  = validateEmpleado(event.body);
  if (errorBody) {
    return createResponse(400, error.details[0].message);
  }

  const empleado = await Empleado.findByIdAndUpdate(
    event.pathParameters.id,
    JSON.parse(event.body),
    { new: true }
  );

  // if there is no record return 404 error
  if (!empleado)
    return createResponse(
      404,
      "El Usuario con el id proporcionado no se ha encontrado"
    );
  // return the response
  return createResponse(200, empleado);
};

// get a record from the database
module.exports.delete = async event => {
  // validate Input Id with Joi
  if(!mongoose.Types.ObjectId.isValid(event.pathParameters.id)){
    return createResponse(400, 'Invalid Id');
  }
  //delete and retreave the empleado
  const empleado = await Empleado.findByIdAndRemove(event.pathParameters.id);
  // if there is no record return 404 error
  if (!empleado) {
    return createResponse(
      404,
      "El Usuario con el id proporcionado no se ha encontrado"
    );
  } else {
    let message = {
      message: `El Usuario: ${empleado.username} con el id: ${
        empleado._id
      } ha sido eliminado`,
      empleado
    };
    return createResponse(200, message);
  }
};
