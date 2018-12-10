'use strict';
//connect to the database
const { User } = require('./model/user');
require('../db')();

// Adding the authentication
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs-then');

function createResponse(statusCode, message){
    return {
      statusCode: statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    }
  }

  /*
  module.exports.register = async (event) => {
       register(JSON.parse(event.body));
        return  createResponse(201, registro);
};

*/


  function signToken(id) {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
      expiresIn: 86400 // expires in 24 hours
    });
  }
  
  function checkIfInputIsValid(eventBody) {
    if (
      !(eventBody.password &&
        eventBody.password.length >= 7)
    ) {
      return Promise.reject(new Error('Password error. Password needs to be longer than 8 characters.'));
    }
  
    if (
      !(eventBody.name &&
        eventBody.name.length > 5 &&
        typeof eventBody.name === 'string')
    ) return Promise.reject(new Error('Username error. Username needs to longer than 5 characters'));
  
    if (
      !(eventBody.email &&
        typeof eventBody.name === 'string')
    ) return Promise.reject(new Error('Email error. Email must have valid characters.'));
  
    return Promise.resolve();
  }
  
  function register(eventBody) {

    return checkIfInputIsValid(eventBody) // validate input
      .then(() =>
        User.findOne({ email: eventBody.email }) // check if user exists
      )
      .then(user =>
        user
          ? Promise.reject(new Error('User with that email exists.'))
          : bcrypt.hash(eventBody.password, 8) // hash the pass
      )
      .then(hash =>
        User.create({ name: eventBody.name, email: eventBody.email, password: hash }) 
        // create the new user
      )
      .then(user => ({ auth: true, token: signToken(user._id) })); 
      // sign the token and send it back
  }
/*
// login
  module.exports.login = (event) => {
       let session =  login(JSON.parse(event.body))
       return  createResponse(201, session);
  };
*/

  function login(eventBody) {
    return User.findOne({ email: eventBody.email })
      .then(user =>
        !user
          ? Promise.reject(new Error('User with that email does not exits.'))
          : comparePassword(eventBody.password, user.password, user._id)
      )
      .then(token => ({ auth: true, token: token }));
  }
  
  function comparePassword(eventPassword, userPassword, userId) {
    return bcrypt.compare(eventPassword, userPassword)
      .then(passwordIsValid =>
        !passwordIsValid
          ? Promise.reject(new Error('The credentials do not match.'))
          : signToken(userId)
      );
  }


  module.exports.me = (event) => {
       let me =  me(event.requestContext.authorizer.principalId) // the decoded.id from the VerifyToken.auth will be passed along as the principalId under the authorizer
       return  createResponse(200, me);
  };
  

  function me(userId) {
    return User.findById(userId, { password: 0 })
      .then(user =>
        !user
          ? Promise.reject('No user found.')
          : user
      )
      .catch(err => Promise.reject(new Error(err)));
  }