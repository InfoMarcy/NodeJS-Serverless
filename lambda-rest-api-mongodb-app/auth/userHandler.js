'use strict';

//connect to the database
const { User } = require('./model/user');
require('../db')();

function createResponse(statusCode, message){
    return {
      statusCode: statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    }
  }

// get a list of users
module.exports.getUsers = async (event) => {
    const users = await User.find().sort("name");
    
    if (!users){
      return createResponse(404, 'No hay usuarios disponible por el momento, gracias!!!');
     } 
      return createResponse(200, users);
  };