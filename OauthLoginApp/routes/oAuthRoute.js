const express = require("express");
const router = express.Router();
//============================= Oauth =============================//
const OAuth2Server = require("oauth2-server");
const AccessDeniedError = require("oauth2-server/lib/errors/access-denied-error");
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;
const oAuthModels = require("../model/oAuth2/oAuthModel");
const OAuthUsersModel = require("../model/oAuth2/oAuthUserModel");
const OAuthClientsModel = require("../model/oAuth2/oauth_client");
const clientCredentiasl = require("../middleware/oAuthClientCredentials");

const oauth = new OAuth2Server({
  model: oAuthModels,
  grants: ["password", "authorization_code", "refresh_token"]
});

let request = new Request({
  method: "GET",
  query: {},
  headers: { Authorization: "Bearer foobar" }
});

let response = new Response({
  headers: {}
});
//============================= Oauth =============================//

//get the access token
router.post("/token", (req, res, next) => {
  oauth
    .token(request, response)
    .then(token => {
      // The resource owner granted the access request.
    })
    .catch(err => {
      // The request was invalid or not authorized.
    });
});

//authorize the request
router.get("/authorize", (req, res, next) => {
  oauth
    .authorize(request, response)
    .then(code => {
      // The resource owner granted the access request.
    })
    .catch(err => {
      if (err instanceof AccessDeniedError) {
        // The resource owner denied the access request.
      } else {
        // Access was not granted due to some other error condition.
      }
    });
});

//authenticate
router.get("/authenticate", (req, res, next) => {
  oauth
    .authenticate(request, response)
    .then(token => {
      // The request was successfully authenticated.
    })
    .catch(err => {
      // The request failed authentication.
    });
});

// Register a new user in the server of OAuth
router.post("/usuario/register", (req, res, next) => {
  OAuthUsersModel.findOne({ email: req.body.email }, function(err, user) {
    if (user) {
      res.status(400).send({ mensaje: "El correo ya se encuentra registrado" });
    }
  });
  // Collect the data to register a new user
  const nuevoUsuario = {
    email: req.body.email,
    password: req.body.password,
    nombre: req.body.nombre,
    apellidoPaterno: req.body.apellidoPaterno,
    apellidoMaterno: req.body.apellidoMaterno
  };
  OAuthUsersModel.register(nuevoUsuario, function(err, user) {
    if (err) return next(err);
    res.send(user);
  });
});

// Register an app
router.post("/app/register", (req, res, next) => {
  // authenticate that the user is registered
  OAuthUsersModel.getUser(req.body.email, req.body.password, function(
    err,
    email
  ) {
    if (err) return next(err);

    console.log("email => ", email)
    //check if the user exist in the clients app
    OAuthClientsModel.findOne({ email: email }).then(cliente => {
      if (cliente) {
        return res
          .status(400)
          .send({ mensaje: "El cliente ya se encuentra registrado" });
      } else {
        // Register the client app
        OAuthClientsModel.create(
          {
            clientId: clientCredentiasl.generarClientId(),
            clientSecret: clientCredentiasl.generarClientSecret(),
            redirectUri: req.body.redirectUri,
            appName: req.body.appName,
            appUri: req.body.appUri,
            appDescription: req.body.appDescription,
            email: email
          },
          function(err, app) {
            if (err) return next(err);
            return res
              .status(200)
              .send({ "App registered Successfully app => ": app });
          }
        );
      }
    });
  });
});

module.exports = router;
