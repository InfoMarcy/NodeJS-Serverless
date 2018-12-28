const mongoose = require('mongoose');
const Joi = require('joi');

//Models class
const ClienteUnico = mongoose.model('ClienteUnico', new mongoose.Schema({
    pais: {
        type: String,
        required: true,
        maxlength: 3
    },

    canal: {
        type: String,
        required: true,
        maxlength: 3
    },

    sucursal: {
        type: String,
        required: true,
        maxlength: 5
    },

    apePaterno: {
        type: String,
        required: true,
        maxlength: 50
    },

    apeMaterno: {
        type: String,
        maxlength: 50
    },

    calle: {
        type: String,
        maxlength: 50
    },


    numExt: {
        type: String,
        maxlength: 5
    },

    numInt: {
        type: String,
        maxlength: 5
    },

    colonia: {
        type: String,
        required: true,
        maxlength: 65
    },


    cp: {
        type: String,
        required: true,
        maxlength: 5
    },


    sexo: {
        type: String,
        required: true,
        maxlength: 1
    },

    idTipoPersona: {
        type: String,
        required: true,
        maxlength: 2
    },

    fecNacimiento: {
        type: String,
        required: true,
        maxlength: 10
    },


    poblacion: {
        type: String,
        required: true,
        maxlength: 65
    },


    estado: {
        type: String,
        required: true,
        maxlength: 65
    },

    lada: {
        type: String,
        required: false,
        maxlength: 3
    },

    telefonoDomicilio: {
        type: String,
        required: false,
        maxlength: 10
    },

    rfc: {
        type: String,
        required: true,
        maxlength: 13
    },

    extTelefono: {
        type: String,
        required: false,
        maxlength: 5
    },

    huellaOT1: {
        type: String,
        required: true
    },

    manoOT1: {
        type: String,
        required: false
    },


    dedoOT1: {
        type: String,
        required: false
    },

    cadenaFoto: {
        type: String,
        required: false
    },

    idActividad: {
        type: String,
        required: true,
        maxlength: 3
    },

    idEstadoCivil: {
        type: String,
        required: true,
        maxlength: 1
    },

    idIdentificacion: {
        type: String,
        required: true,
        maxlength: 2
    },


    folioIdentificacion: {
        type: String,
        required: false,
        maxlength: 30
    },


    idNacionalidad: {
        type: String,
        required: true,
        maxlength: 3
    },

    curp: {
        type: String,
        required: false,
        maxlength: 18
    },

    email: {
        type: String,
        required: false
    },

    manoOT2: {
        type: String,
        required: false
    },

    dedoOT2: {
        type: String,
        required: false
    },


    huellaOT2: {
        type: String,
        required: true
    },


    idEntidadFederativa: {
        type: String,
        required: true,
        maxlength: 2
    },

    ladaCelular: {
        type: String,
        required: false,
        maxlength: 3
    },

    telefonoCelular: {
        type: String,
        required: false,
        maxlength: 10
    },

    idCompaniaCelular: {
        type: String,
        required: false,
        maxlength: 3
    },


    idTipoVivienda: {
        type: String,
        required: true,
        maxlength: 3
    },

    ipAutenticacion: {
        type: String,
        required: true
    },

    usuarioAutenticacion: {
        type: String,
        required: true
    }

}));

// validate validateClienteUnico
function validateClienteUnico(cliente){
    // if invalid 400  - Bad Request // joi input validation
   const schema = {
       email: Joi.string().min(3).max(50).email()
   };
   return Joi.validate(cliente, schema);
};

exports.ClienteUnico = ClienteUnico;
exports.validate = validateClienteUnico;