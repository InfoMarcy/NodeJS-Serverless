//library for validating inputs
const Joi = require("joi");

module.exports = function() {
  //library for validating mongodb id
  Joi.objectId = require("joi-objectid")(Joi);
};
