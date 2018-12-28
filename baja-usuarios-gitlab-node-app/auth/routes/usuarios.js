const express = require('express');
const router = express.Router();
const { Usuario, validarUsuario} = require('../model/usuario');
const auth = require('../../middleware/auth');

// used for working with objects
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

// get the information of the client
router.get('/me', auth, async (req, res) => {
 const usuario =  await Usuario.findById(req.usuario._id).select('-password');
res.send(usuario);
});


// create a record in the database
router.post('/', async (req, res) => {
 
      // validate the body of the request
      const { error } = validarUsuario(req.body);
      if (error) return res.status(400).send(error.details[0].message)


      // find usuario by email
      let usuario = await Usuario.findOne({ numEmpleado: req.body.numEmpleado });

      // check if the usuario exist
      if(usuario) return res.status(400).send('usuario already registered.');

      // create the usuario
   usuario = new Usuario(_.pick(req.body, ['username', 'numEmpleado', 'password']));

   // hash password
   const salt=  await bcrypt.genSalt(16);
   usuario.password =  await bcrypt.hash(usuario.password, salt);
   //save the usuario
   await usuario.save();


     //json web token with config
     const token  = usuario.generateAuthToken();
  // return the new usuario
    res.header('x-auth-token', token).send(_.pick(usuario, ['_id', 'username', 'numEmpleado']));
});

module.exports = router;