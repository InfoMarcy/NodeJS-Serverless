module.exports = {
  //valida la contraseña contra el hash
  validatePassword: function(pass1, pass2) {
    if (pass1.toString().trim() === pass2.toString().trim()) {
      return true;
    } else {
      return false;
    }
  },

  validateUsuarioPasswordIguales: function(user, pass) {
    if (user.toString().trim() === pass.toString().trim()) {
      return true;
    } else {
      return false;
    }
  }
};
