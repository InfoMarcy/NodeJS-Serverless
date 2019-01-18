const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorizedClientIds = ['papers3', 'papers3-mac'];

const OAuthClientsSchema = new Schema({
  clientId: {type: String, required: true, unique: true},
  clientSecret: {type: String, required: true},
  redirectUri: {type: String, required: true},
  appName: {type: String, required: true},
  appUri: {type: String, required: true},
  appDescription: {type: String},
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 50
  }

});

OAuthClientsSchema.static('getClient', function(clientId, clientSecret, callback) {
  const params = { clientId: clientId };
  if (clientSecret != null) {
    params.clientSecret = clientSecret;
  }
  OAuthClientsModel.findOne(params, callback);
});

OAuthClientsSchema.static('grantTypeAllowed', function(clientId, grantType, callback) {
  if (grantType === 'password' || grantType === 'authorization_code') {
    return callback(false, authorizedClientIds.indexOf(clientId) >= 0);
  }
  callback(false, true);
});

mongoose.model('oauth_clients', OAuthClientsSchema);
const OAuthClientsModel = mongoose.model('oauth_clients');


module.exports = OAuthClientsModel;
