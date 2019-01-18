const oAuthUserModel = require('../model/oAuthUserModel');
const OAuthClientsModel = require('../model/oauth_client');
module.exports = function() {

    oAuthUserModel.create({
        email: 'alex@example.com',
        hashed_password: '$2a$10$aZB36UooZpL.fAgbQVN/j.pfZVVvkHxEnj7vfkVSqwBOBZbB/IAAK'
      }, function() {
        OAuthClientsModel.create({
          clientId: 'papers3',
          clientSecret: '123',
          redirectUri: '/oauth/redirect'
        }, function() {
          process.exit();
        });
      });

};



// {
	
// 	"email": "marci.garcia@bancoazteca.com",
// 	"password": "1234567890",
// 	"firstname": "Marci",
// 	"lastname": "Garcia"
//reset_token_expires
// }