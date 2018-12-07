'use strict';

//connect to the database
const { User } = require('./models/user');
require('./db')();

function createResponse(statusCode, message){
  return {
    statusCode: statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  }
}

module.exports.create = async (event) => {

  let user = new User(JSON.parse(event.body));
      user = await user.save();
      return  createResponse(201, user);
};

// get a record from the database
module.exports.getOne = async (event) => {
  const user = await User.findById(event.pathParameters.id);
   // if there is no record return 404 error
   if (!user){
    return createResponse(404, 'El Usuario con el id proporcionado no se ha encontrado');
   } else {
    return createResponse(200, user);
   }
   
};

// get a list of users
module.exports.getAll = async (event) => {
  const users = await User.find().sort("nombre");
  
  if (!users){
    return createResponse(404, 'No hay usarios disponible por el momento, gracias!!!');
   } 
    return createResponse(200, users);
};


// update a record in the db
module.exports.update = async (event) => {
 
  const user = await User.findByIdAndUpdate(
    event.pathParameters.id,
    JSON.parse(event.body),
    { new: true }
  );

  // if there is no record return 404 error
  if (!user)
    return res.status(404).send("El Usuario con el id proporcionado no se ha encontrado");
  // return the response
  return createResponse(200, user);

};

// get a record from the database
module.exports.delete = async (event) => {
//delete and retreave the user
const user = await User.findByIdAndRemove(event.pathParameters.id);
   // if there is no record return 404 error
   if (!user){
    return createResponse(404, 'El Usuario con el id proporcionado no se ha encontrado');
   } else {

   let message = {
   "message": `El Usuario: ${user.username} con el id: ${user._id} ha sido eliminado`,
    user
    }; 
    return createResponse(200, message);
   }
  }
