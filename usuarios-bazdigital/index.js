// load the express framework module
const express = require('express');
const app = express();// call the express function which return an object

require('./startup/logs')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
// Environment variable
const port = process.env.PORT || 3000; //listen on a given port
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;