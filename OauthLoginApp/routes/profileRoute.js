const express = require("express");
const router = express.Router();
const authCheck = require("../middleware/authCheck");

//profile page
router.get("/", authCheck, (req, res) => {
  // handle with pasport
  res.send("Welcome to your profile, " + req.user.username);
});

module.exports = router;
