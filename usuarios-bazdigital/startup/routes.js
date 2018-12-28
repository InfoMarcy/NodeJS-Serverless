const express = require('express');
//middleware for working with errore
const error = require('../middleware/error');
// genre APIS
const clienteUnico = require('../routes/ClienteUnicoServiceAltaCU');
//const users = require('../auth/routes/users');//Users
//const auth = require('../auth/routes/login'); //Login

module.exports  = function(app){

app.use(express.json()); // enable json req.body
app.use('/api/v1/clienteunico', clienteUnico); 

// to handle the errors
app.use(error);
}