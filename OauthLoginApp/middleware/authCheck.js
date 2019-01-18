// verify that the user has a token an acces to access the apis
module.exports = function(req, res, next) {
  // if user is not logged in
  if (!req.user) {
    res.redirect("/auth/login");
  } else {
    // if logged in
    next();
  }
};
