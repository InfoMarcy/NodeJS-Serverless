module.exports = {
    //valida la contraseña contra el hash
    getAccessToken: function(accessToken) {
         // imaginary DB queries
  db.queryAccessToken({access_token: accessToken})
  .then(function(token) {
    return Promise.all([
      token,
      db.queryClient({id: token.client_id}),
      db.queryUser({id: token.user_id})
    ]);
  })
  .spread(function(token, client, user) {
    return {
      accessToken: token.access_token,
      accessTokenExpiresAt: token.expires_at,
      scope: token.scope,
      client: client, // with 'id' property
      user: user
    };
  });
  
    },
  
    validateUsuarioPasswordIguales: function(user, pass) {
      if (user.toString().trim() === pass.toString().trim()) {
        return true;
      } else {
        return false;
      }
    }
  };
  