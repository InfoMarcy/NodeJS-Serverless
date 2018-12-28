const express = require('express');
const router = express.Router();
// used for working with objects
const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { Usuario } = require('../model/usuario');

// create a record in the database
router.post('/', async (req, res) => {
      // validate the body of the request
      const { error } = validate(req.body);
      if (error) return res.status(400).send(error.details[0].message)

      // find usuario by email
      let usuario = await Usuario.findOne({ numEmpledo: req.body.numEmpledo });
      

      // validate if the email exist
      if(!usuario) return res.status(400).send('Número de empleado o  contraseña invalida');

      // validate the password 
     const validPassword =  await  bcrypt.compare(req.body.password, usuario.password);

        // validate if the email exist
        if(!validPassword) return res.status(400).send('Número de empleado o  contraseña invalida');

        //json web token with config
         //json web token with config
     const token  = usuario.generateAuthToken();
      //  const token  = jwt.sign({ _id: usuario._id}, config.get('jwtPrivateKey')); 
        res.send(token);
});





function validate(req) {
    const schema = {
      numEmpleado: Joi.string().min(3).max(10).required(),
      password: Joi.string().min(3).max(1024).required()
    };
  
    return Joi.validate(req, schema);
  }
module.exports = router;