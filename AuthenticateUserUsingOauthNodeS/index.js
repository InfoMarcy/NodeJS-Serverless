'use strict';
// load the express framework module
const express = require("express");
const app = express(); // call the express function which return an object
const config = require("config");


require("./controller/logs")();
//require("./controller/appController")(app);
require('./startup/db')();

//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("index");


// ================================= Oauth 2 server ===========================================================//
 //Expose server and request/response classes.
exports = module.exports = require('./lib/server');
exports.Request = require('./lib/request');
exports.Response = require('./lib/response');

 // Export helpers for extension grants.
exports.AbstractGrantType = require('./lib/grant-types/abstract-grant-type');

// Export error classes.
exports.AccessDeniedError = require('./lib/errors/access-denied-error');
exports.InsufficientScopeError = require('./lib/errors/insufficient-scope-error');
exports.InvalidArgumentError = require('./lib/errors/invalid-argument-error');
exports.InvalidClientError = require('./lib/errors/invalid-client-error');
exports.InvalidGrantError = require('./lib/errors/invalid-grant-error');
exports.InvalidRequestError = require('./lib/errors/invalid-request-error');
exports.InvalidScopeError = require('./lib/errors/invalid-scope-error');
exports.InvalidTokenError = require('./lib/errors/invalid-token-error');
exports.OAuthError = require('./lib/errors/oauth-error');
exports.ServerError = require('./lib/errors/server-error');
exports.UnauthorizedClientError = require('./lib/errors/unauthorized-client-error');
exports.UnauthorizedRequestError = require('./lib/errors/unauthorized-request-error');
exports.UnsupportedGrantTypeError = require('./lib/errors/unsupported-grant-type-error');
exports.UnsupportedResponseTypeError = require('./lib/errors/unsupported-response-type-error');

// ================================= Oauth 2 server ===========================================================//



// Environment variable
//const port = process.env.PORT || 3000; //listen on a given port
// const server = app.listen(port, () =>
//   logger.info(
//     `La applicacion ${config.get(
//       "name"
//     )} esta corriendo en el puerto: ${port} y en el ambiente de: ${app.get(
//       "env"
//     )}.`
//   )
// );

// module.exports.oauth = require('./model/oAuthModel');
// module.exports.User = require('./model/oAuthUserModel');
// module.exports.OAuthClientsModel = require('./model/oauth_client');

// module.exports = server;



// {
// 	"email": "marci8.garcia@bancoazteca.com",
// 	"password": "1234567890",
// 	"appName": "BancoAzteca",
//     "appUri": "https://www.npmjs.com/package/mongoose-type-url",
//     "appDescription": "bank of mexico",
//     "redirectUri": "sfsdfsd"

// }