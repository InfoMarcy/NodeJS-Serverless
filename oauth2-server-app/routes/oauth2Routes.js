const express = require("express");
const router = express.Router();
const authController = require('../controller/authController');

// Create endpoint handlers for oauth2 authorize
router.route('/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision);


// Create endpoint handlers for oauth2 token
router.route('/token')
  .post(authController.isClientAuthenticated, oauth2Controller.token);

module.exports = router;