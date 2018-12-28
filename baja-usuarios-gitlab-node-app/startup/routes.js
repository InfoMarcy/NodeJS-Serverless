const express = require('express');
//middleware for working with errore
const error = require('../middleware/error');

// Usuarios APIS
const usuario = require('../auth/routes/usuarios'); // Usuarios routes
const auth = require('../auth/routes/auth'); // Auth route
const bloquearUsuarioGit = require('../routes/obtenerGitUser'); // block usuario
const desbloquearUsuarioGit = require('../routes/desbloquearGitUser'); // unblock usuario

//Logs
const log4js = require('log4js');
const logger = log4js.getLogger();

module.exports  = function(app){

app.use(express.json()); // enable json req.body
app.use('/api/v1/gitlab/register/usuarios', usuario); 
app.use('/api/v1/gitlab/auth/login', auth); 
app.use('/api/v1/gitlab/bloquear/usuario', bloquearUsuarioGit); 
app.use('/api/v1/gitlab/desbloquear/usuario', desbloquearUsuarioGit); 
app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO, format: ':method :url' }));
// to handle the errors
app.use(error);
}