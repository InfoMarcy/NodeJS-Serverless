const AuthCode = require("./oauth_authcode");
const AccessToken = require("./oauth_accesstoken");
const RefreshToken = require("./oauth_refreshtoken");
const User = require("./oAuthUserModel");
const Client = require("./oauth_client");

// node-oauth2-server API
module.exports.getAuthCode = AuthCode.getAuthCode;
module.exports.saveAuthCode = AuthCode.saveAuthCode;
module.exports.getAccessToken = AccessToken.getAccessToken;
module.exports.saveAccessToken = AccessToken.saveAccessToken;
module.exports.saveRefreshToken = RefreshToken.saveRefreshToken;
module.exports.getRefreshToken = RefreshToken.getRefreshToken;
module.exports.getUser = User.getUser;
module.exports.getClient = Client.getClient;
module.exports.grantTypeAllowed = Client.grantTypeAllowed;
