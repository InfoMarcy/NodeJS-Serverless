// VerifyToken.js

const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// Policy helper function
const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2018-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
}

module.exports.auth = (event) => {

  // check header or url parameters or post parameters for token
  const token = event.authorizationToken;

  if (!token)
    return  'Unauthorized';

  // verifies secret and checks exp
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return 'Unauthorized';

    // if everything is good, save to request for use in other routes
    return  generatePolicy(decoded.id, 'Allow', event.methodArn);
  });

};