const express = require("express");
const router = express.Router();
// used for working with objects
const _ = require("lodash");
const passport = require("passport");

//Cifrado
const crypto = require("crypto-js");

const { LocalUser, validateLocalUser } = require("../model/localUserModel");
const validaciones = require("../middleware/validaciones");

//auth with login
router.post("/register", async (req, res) => {
  // validate the body of the request
  const { error } = validateLocalUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const validateUser_Pass = validaciones.validateUsuarioPasswordIguales(
    req.body.email,
    req.body.password
  );
  if (validateUser_Pass)
    return res.status(400).send({
      mensaje: "El email y el password no pueden ser iguales"
    });

  // find user by email
  let user = await LocalUser.findOne({ email: req.body.email });

  // check if the user exist
  if (user) return res.status(400).send("User already registered.");

  // create the user
  user = new LocalUser(_.pick(req.body, ["name", "email", "password"]));

  // hash password
  user.password = crypto.SHA256(req.body.password).toString();
  //save the user
  await user.save();
  res.send("User Register Succesfully");
});

//auth with login
router.post("/login", async (req, res) => {
  // validate the body of the request
  const { error } = validateLocalUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // find user by email
  let user = await LocalUser.findOne({ email: req.body.email });

  // validate if the email exist
  if (!user) return res.status(400).send("Invalid email or password");

  // validate the password against the json file
  const validPassword = validaciones.validatePassword(
    user.password,
    crypto.SHA256(req.body.password).toString()
  );
  // validate if the email exist
  if (!validPassword) {
    return res.status(400).send("Invalid email or password");
  } else {
    // const token  = user.generateAuthToken();
    // res.send(token);
    res.send("logged in");
  }
});

//auth with google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

//auth logout
router.get("/salir", (req, res) => {
  // handle with pasport
  req.logOut();
  res.redirect("/");
});

//auth logout
router.get(
  "/google/redirect",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // handle with pasport
    //res.send(req.user);
    res.redirect("/profile/");
  }
);

module.exports = router;
