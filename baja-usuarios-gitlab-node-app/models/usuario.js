const fs = require('fs');
const path = require('path');
const  obtenerUsuarios = require('../middleware/obtenerUsuariosFromFile');

module.exports = class Usuario {
    constructor(username, password, numEmpleado){
     this.username = username;
     this.password = password;
     this.numEmpleado = numEmpleado;
    }

    // method to get all records from the class
    static getAll(cb){
      obtenerUsuarios(cb);
    }
}

