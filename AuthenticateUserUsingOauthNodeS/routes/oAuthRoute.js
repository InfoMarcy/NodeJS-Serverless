const express = require("express");
const router = express.Router();
var OAuthUsersModel = require("../model/oAuthUserModel");
const { requiresUser } = require("../middleware/oAuthUsers");
const oAuthUserModel = require("../model/oAuthUserModel");
const OAuthClientsModel = require("../model/oauth_client");
const hashed_password = require("../middleware/hashPassword");
const clientCredentiasl = require("../middleware/oAuthClientCredentials");


// Register a new user in the server of OAuth
router.post("/register", (req, res, next) => {
  OAuthUsersModel.findOne({ email: req.body.email }, function (err, user) {
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
  }
  OAuthUsersModel.register(nuevoUsuario, function (err, user) {
    if (err) return next(err);
    res.send(user);
  });
});

// Get a user from the server
router.post("/login", (req, res, next) => {
  OAuthUsersModel.getUser(req.body.email, req.body.password , function(err, email) {
    if (err) return next(err);
    res.send(email);
  });
});

// Register an app 
router.post("/app", (req, res, next) => {
  OAuthUsersModel.getUser(req.body.email, req.body.password , function(err, email) {
    if (err) return next(err);

    OAuthUsersModel.findOne({email : email}).then( (cliente) => {
      if(cliente){
      return  res.status(400).send({mensaje : 'El cliente ya se encuentra registrado'})
      }
    });
      //register the app 
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
          if(err) return next(err);
          res.status(200).send({"App registered Successfully app => ": app}) ;
        }
      );
  });
});




// Get the acccess token and refresh token (Authorization: Basic clientId:ClientSecret)
// input query parameters => grant_type, code, clientId, redirectUri
//Authorization: Basic asdadsad
// grant_type=authorization_code
// &code=12321334
//output => acccess token and refresh toke
// HTTP/1.1 200 OK
// Contetn-Type: application/json
// {
// "accessToken": "123456",
// "tokenType": "Bearer",
// "refreshToken": "534231321",
// "expira_en": 3600
// }

router.post("/token", (req, res, next) => {

  res.status(200).send(
    {
      "accessToken": accessToken,
      "tokenType": "Bearer",
      "refreshToken": refreshToken,
      "expira_en": 3600
    }
  )

});


// Get the  authorization Code
// GET /auhtorize?response_type=code
//&scope=name
//&clientId=123344
//&state=123213213
//&redirectUrl=url
// output => // Location: https://clientexample.com/cb?
// code=mycode
// &state=s12342tate
router.get("/authorize", (req, res, next) => {


  res.redirect(`${url}&code=${code}&state=${state}`);
});


module.exports = router;

// HTTP/1.1 200 OK
// Location: https://example.com/cb?
// code=mycode
// &state=mystate

// HTTP/1.1 302 Found
// Contetn-Type: application/json
// {
// "accessToken": "123456",
// "tokenType": "Bearer",
// "refreshToken": "534231321",
// "expira_en": 3600
// }

//Para consumie un API
//GET /api
//Authorization: Bearer 132132133
// HTTP/1.1 200 OK
//output => {data}