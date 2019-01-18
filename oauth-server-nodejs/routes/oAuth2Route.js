var express = require("express");
var actions = require("../methods/actions");
var auth = require("../methods/auth");
var clients = require("../methods/client");
var oauth2 = require("../methods/oauth2");

var router = express.Router();

// authenticate
router.post("/authenticate", actions.authenticate);

//Step 1:
//You will register your app with their platform (something like developer.twitter.com) and they will provide you with an APP_ID and a secret.
router.route("/clients").post(auth.isAuthenticated, clients.postClients).get(auth.isAuthenticated, clients.getClients);


// Step 2:
// Then you will make a call to their platform from your App (Usually to an URL like /companyname/authorize) along with your App_Id and secret. 
// You will get a bearer token in return.
router.route("/authorize").get(oauth2.authorization).post(oauth2.decision);

// Step 3:
// You will then use this bearer token to make a call to a different URL which would then return an access token. 
// If you receive the access token then you are authorized.
router.route("/token").post(auth.isClientAuthenticated, oauth2.token);


// Step 4:
// Then you could use this access token to make authorized requests to the API’s without using your username or password anywhere.
router.post("/adduser", actions.addNew);
router.get("/getinfo", actions.getinfo);
router.post("/addbook", auth.isBearerAuthenticated, actions.addBook);
router.get("/getbooks", auth.isBearerAuthenticated, actions.getBooks);

module.exports = router;
