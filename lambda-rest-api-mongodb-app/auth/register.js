"use strict";
//connect to the database
const { User, validateUser } = require("./model/user");
require("../db")();

// Adding the authentication
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs-then");

function createResponse(statusCode, message) {
  return {
    statusCode: statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
  };
}

module.exports.register = async event => {
  // validate Input with Joi
  const { error } = validateUser(event.body);
  if (error) {
    return createResponse(400, error.details[0].message);
  }

 // register(JSON.parse(event.body));
  return createResponse(201, 'registro');
};
