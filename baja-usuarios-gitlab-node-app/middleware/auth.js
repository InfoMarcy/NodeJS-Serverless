const jwt = require('jsonwebtoken');
const config = require('config');


// verify that the user has a token an acces to access the apis
module.exports = function (req, res, next){

    // verify if there is a token on the header
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No token provided. ');
   
// verify json web token if it is valid it will decoy it and return the payload
try{
    const decoded = jwt.verify(token, config.get('private_token'));
    req.usuario = decoded;
    next();
}catch(ex){
    res.status(400).send('Invalid Token.');
}
}