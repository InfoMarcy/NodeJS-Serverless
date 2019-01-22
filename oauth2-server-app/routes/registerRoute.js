const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const crypto = require("crypto-js");
const validaciones = require("../middleware/validaciones");
const oauth2UserRepository = require("../repository/oauth2UserRepository");
const oauth2ClienteRepository = require("../repository/oauth2ClientRepository");
const auth = require("../middleware/auth");

const clientCredentiasl = require("../middleware/oAuthClientCredentials");

// 1. => Register a new user in the server of OAuth
router.post("/usuario/register", (req, res, next) => {
  // validate the body of the request
  const { error } = validaciones.validarOauthUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // get the user from the json file by email
  let oauth2User = oauth2UserRepository.getByEmail(req.body.email);

  if (oauth2User) {
    return res.status(400).send({
      success: false,
      mensaje: "El correo ya se encuentra registrado"
    });
  } else {
    // Collect the data to register a new user
    const nuevoUsuario = {
      userId: new mongoose.Types.ObjectId().toString(),
      email: req.body.email,
      password: crypto.SHA256(req.body.password).toString(),
      nombre: req.body.nombre,
      apellidoPaterno: req.body.apellidoPaterno,
      apellidoMaterno: req.body.apellidoMaterno,
      date: new Date()
    };

    let userCreate = oauth2UserRepository.create(nuevoUsuario);

    if (userCreate) {
      return res
        .status(200)
        .send({ success: true, mensaje: "Usuario registrado exitosamente" });
    } else {
      return res.status(500).send({
        success: false,
        mensaje: "Incidencia al registrar el Usuario"
      });
    }
  }
});

// register a client
router.post("/Cliente/register", auth, (req, res, next) => {
  // validate the body of the request
  const { error } = validaciones.validarCliente(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // get the user from the json file by email
  let oauth2Cliente = oauth2ClienteRepository.getByUserId(res.locals.userId);

  if (oauth2Cliente) {
    return res.status(400).send({
      success: false,
      mensaje: "El Cliente ya esta registrado"
    });
  } else {
    const clienteApp = {
      clientId: clientCredentiasl.generarClientId(),
      clientSecret: clientCredentiasl.generarClientSecret(),
      userId: res.locals.userId,
      redirectUri: req.body.redirectUri,
      appName: req.body.appName,
      appUri: req.body.appUri,
      appDescription: req.body.appDescription,
      grants: []
    };
    let createClienteApp = oauth2ClienteRepository.create(clienteApp);
    if (createClienteApp) {
      return res.status(200).send({
        success: true,
        mensaje: "El Cliente ha sido registrado exitosamente"
      });
    } else {
      return res.status(500).send({
        success: false,
        mensaje: "Incidencia al registrar el Cliente"
      });
    }
  }
});

// register a client
router.post("/app/cliente", auth, (req, res, next) => {
  // validate the body of the request
  const { error } = validaciones.validarCliente(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // get the user from the json file by email
  let oauth2Cliente = oauth2ClienteRepository.getByUserId(res.locals.userId);

  if (oauth2Cliente) {
    res.status(200).send({
      success: true,
      client_id: oauth2Cliente.clientId,
      client_secret: oauth2Cliente.clientSecret
    });
  } else {
    res.status(500).send({
      success: false,
      mensaje: "Incidencia al obtener el Cliente"
    });
  }
});

module.exports = router;


// var CodeSchema   = {
//   authorizationCode: { type: String, required: true },
//   redirectUri: { type: String, required: true },
//   userId: { type: String, required: true },
//   clientId: { type: String, required: true }
// };


// var TokenSchema   = new mongoose.Schema({
//   token: { type: String, required: true },
//   userId: { type: String, required: true },
//   clientId: { type: String, required: true }
// });

// Authorization: Bearer <access token> header

// HTTPS and hashing the client secret, authorization code, and access token. 