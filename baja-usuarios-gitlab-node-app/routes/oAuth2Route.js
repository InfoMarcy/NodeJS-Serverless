const express = require("express");
const router = express.Router();

const config = require("config");
const request = require('request')

//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("oAuth2Router");
const oAuth2 = require("../middleware/oAuth2.js");

// Get an item By ID from the database
router.post("/login", async (req, res) => {
  const userCredentials = {
    name: req.body.username,
    password: req.body.password
  };

  // Set the headers
  const headers = {
    "Content-Type": "application/json"
  };

  // Configure the request
  const options = {
    uri: "http://localhost:3333/oauth/authenticate",
    headers: headers,
    form: userCredentials
  };

  request.post(options, (error, response, body) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(`statusCode: ${response.statusCode}`);
    console.log(body);

    if (response.statusCode == 200) {
      res.send( body );
    }
  });

  res.send({ mensaje: user });
  //res.status(200).send('got it', user);
});

// Get an item By ID from the database
router.post("/addClient", async (req, res) => {
   const newClient = {
      name: '',
      appId: '',
      appSecret: ''
   };
 
   // Set the headers
   const headers = {
     "Content-Type": "application/json"
   };
 
   // Configure the request
   const options = {
     uri: "http://localhost:3333/oauth/clients",
     headers: headers,
     form: userCredentials
   };
 
   request.post(options, (error, response, body) => {
     if (error) {
       console.error(error);
       return;
     }
     console.log(`statusCode: ${response.statusCode}`);
     console.log(body);
 
     if (response.statusCode == 200) {
       res.send( body );
     }
   });
 
   res.send({ mensaje: user });
 });

module.exports = router;
