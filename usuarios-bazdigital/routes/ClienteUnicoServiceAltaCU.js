const express = require("express");
const router = express.Router();
const { ClienteUnico, validate } = require("../models/AltaClienteUnicoModel");
//const auth = require("../middleware/auth");
//const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

// route to get all the Genres from the database
router.get("/", async (req, res, next) => {
  //throw new Error('Could not get the genres. yeah');
  const clienteUnico = await ClienteUnico.find();
  res.send(clienteUnico);
});

// Get an item By ID from the database
router.get("/:id", validateObjectId, async (req, res) => {
  //delete and retreave the clienteUnico
  const clienteUnico = await ClienteUnico.findById(req.params.id);

  // if there is no record return 404 error
  if (!clienteUnico)
    return res
      .status(404)
      .send("The clienteUnico with the given ID was not found");
  // return the response
  res.send(clienteUnico);
});

// create a record in the database
router.post("/", async (req, res) => {
  // validate the body of the request
  //const { error } = validate(req.body);
  //if (error) return res.status(400).send(error.details[0].message);
  // set the clienteUnico values
  console.log(req.body);

  let clienteUnico = new ClienteUnico({
    pais: req.body.pais,

    canal: req.body.canal,

    sucursal: req.body.sucursal,

    apePaterno: req.body.apePaterno,

    apeMaterno: req.body.apeMaterno,

    calle: req.body.calle,

    numExt: req.body.numExt,

    numInt: req.body.numInt,

    colonia: req.body.colonia,

    cp: req.body.cp,

    sexo: req.body.sexo,

    idTipoPersona: req.body.idTipoPersona,

    fecNacimiento: req.body.fecNacimiento,

    poblacion: req.body.poblacion,

    estado: req.body.estado,

    lada: req.body.lada,

    telefonoDomicilio: req.body.telefonoDomicilio,

    rfc: req.body.rfc,

    extTelefono: req.body.extTelefono,

    huellaOT1: req.body.huellaOT1,

    manoOT1: req.body.manoOT1,

    dedoOT1: req.body.dedoOT1,

    cadenaFoto: 'req.body.cadenaFoto',

    idActividad: req.body.idActividad,

    idEstadoCivil: req.body.idEstadoCivil,

    idIdentificacion: req.body.idIdentificacion,

    folioIdentificacion: req.body.folioIdentificacion,

    idNacionalidad: req.body.idNacionalidad,

    curp: req.body.curp,

    email: req.body.email,

    manoOT2: 'req.body.manoOT2',

    dedoOT2: 'req.body.dedoOT2',

    huellaOT2: 'req.body.huellaOT2',

    idEntidadFederativa: req.body.idEntidadFederativa,

    ladaCelular: req.body.ladaCelular,

    telefonoCelular: req.body.telefonoCelular,

    idCompaniaCelular: req.body.idCompaniaCelular,

    idTipoVivienda: req.body.idTipoVivienda,

    ipAutenticacion: req.body.ipAutenticacion,

    usuarioAutenticacion: req.body.usuarioAutenticacion
  });
  // save to database
  clienteUnico = await clienteUnico.save();
  // send back the responds
  res.send(clienteUnico);
});

// update a record in the database
router.put("/:id", validateObjectId, async (req, res) => {
  // validate the body of the request
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //update and retreave the clienteUnico
  const clienteUnico = await ClienteUnico.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );

  // if there is no record return 404 error
  if (!clienteUnico)
    return res
      .status(404)
      .send("The clienteUnico with the given ID was not found");
  // return the response
  res.send(clienteUnico);
});

module.exports = router;
