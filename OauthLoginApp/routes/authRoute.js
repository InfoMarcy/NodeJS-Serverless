const express = require("express");
const router = express.Router();

const passport = require('passport');

//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("homeRoute");

//auth with login
router.get("/login", (req, res) => {
  res.render("login");
});

//auth with google
router.get("/google", passport.authenticate('google', { scope: ['profile'] }));

//auth logout
router.get("/salir", (req, res) => {
  // handle with pasport
  res.send("Salir de la Applicacion");
});


//auth logout
router.get("/google/redirect", passport.authenticate('google', { failureRedirect: '/login' }),(req, res) => {
  // handle with pasport
  res.send("you reached the call back url");
});





module.exports = router;
