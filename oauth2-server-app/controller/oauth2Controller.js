const oauth2orize = require("oauth2orize");
// Create OAuth 2.0 server
var server = oauth2orize.createServer();
const oauth2ClienteRepository = require("../repository/oauth2ClientRepository");
const genClientTokens = require('../middleware/oAuthClientCredentials');
const oauth2CodeRepository = require("../repository/oauth2CodeRepository");

// Register serialialization function
server.serializeClient(function(client, callback) {
  return callback(null, client.clientId);
});
// Register deserialization function
server.deserializeClient(function(id, callback) {
  // get the user from the json file by email
  let oauth2Cliente = oauth2ClienteRepository.getByClientId(id);

  if (oauth2Cliente) {
    return callback(null, oauth2Cliente);
  } else {
    return callback(new Error("Incidencia al obtener el cliente"));
  }
});

// Register authorization code grant type
server.grant(
  oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
    // Create a new authorization code
    var code = {
      value: genClientTokens.generarCode(),
      clientId: client.clientId,
      redirectUri: redirectUri,
      userId: user.userId
    };
    // create the code for saving
    let oauthCode = oauth2CodeRepository.create(code);

    if (oauthCode) {
      callback(null, oauthCode.value);
    } else {
      return callback(new Error('Incidencia al guardar el Codigo de oauth2'));
    }
  })
);

// Exchange authorization codes for access tokens
server.exchange(
  oauth2orize.exchange.code(function(client, code, redirectUri, callback) {

    // get the user from the json file by email
  let authCode = oauth2CodeRepository.getByCode(code);

  if(!authCode){
    return callback(new Error('Incidencia al obtener el Codigo de oauth2'));
  } 

  if (authCode === undefined) {
    return callback(null, false);
  }


  if (client._id.toString() !== authCode.clientId) {
    return callback(null, false);
  }





    Code.findOne({ value: code }, function(err, authCode) {
      // if (err) {
      //   return callback(err);
      // }
      // if (authCode === undefined) {
      //   return callback(null, false);
      // }
      if (client._id.toString() !== authCode.clientId) {
        return callback(null, false);
      }
      if (redirectUri !== authCode.redirectUri) {
        return callback(null, false);
      }
      // Delete auth code now that it has been used
      authCode.remove(function(err) {
        if (err) {
          return callback(err);
        }
        // Create a new access token
        var token = new Token({
          value: uid(256),
          clientId: authCode.clientId,
          userId: authCode.userId
        });
        // Save the access token and check for errors
        token.save(function(err) {
          if (err) {
            return callback(err);
          }
          callback(null, token);
        });
      });
    });
  })
);

// User authorization endpoint
exports.authorization = [
  server.authorization(function(clientId, redirectUri, callback) {
    Client.findOne({ id: clientId }, function(err, client) {
      if (err) {
        return callback(err);
      }
      return callback(null, client, redirectUri);
    });
  }),
  function(req, res) {
    res.render("dialog", {
      transactionID: req.oauth2.transactionID,
      user: req.user,
      client: req.oauth2.client
    });
  }
];

// User decision endpoint
exports.decision = [server.decision()];

// Application client token exchange endpoint
exports.token = [server.token(), server.errorHandler()];
