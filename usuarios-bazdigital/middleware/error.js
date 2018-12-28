//library for working with  logs
const winston = require('winston');
// error handler
module.exports = function(err, req, res, next){
    //error
    //warn
    //info
    //verbose
    //debug
    //silly
    winston.error(err.message, err);

    //Log the exception
    res.status(500).send("Something went wrong");
};