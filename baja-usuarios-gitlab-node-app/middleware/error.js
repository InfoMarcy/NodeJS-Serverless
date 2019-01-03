//library for working with  logs
//working with log files
const log4js = require('log4js');
const logger = log4js.getLogger("error middleware");
// error handler
module.exports = function(err, req, res, next){
    logger.info({ cgSalida: "CI-120", descSalida: "Incidencia al conectarse con el servidor", err:  err.message, err});


    //Log the exception
    res.status(500).send({ cgSalida: "CI-120", descSalida: "Incidencia al conectarse con el servidor", err:  err.message, err});
};