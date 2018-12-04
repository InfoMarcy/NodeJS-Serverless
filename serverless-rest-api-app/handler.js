'use strict';

module.exports.home = async (event, context) => {

  //hello?name=marcy
  const name = event.queryStringParameters && event.queryStringParameters.name

   let message = 'Hello from lambda serverless';
  if(name !== null){
    message = `Hello ${name} welcome to our serverless app`;
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: message,
      input: event,
    }),
  };
};


module.exports.bancadigital = async (event, context) => {

  //hello?name=marcy
  const id = event.pathParameters && event.pathParameters.id

   let message = "The requested id was not found";
  if(id !== null){
    message = `The id that made the request to banca digital is:  ${id}`;
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: message,
      input: event,
    }),
  };
};


module.exports.identificacion = async (event, context) => {
  const data = JSON.parse(event.body);
  console.log(data);
  return {
    statusCode: 200,
    body: JSON.stringify({
      
        "codigoOperacion": "0",
        "descripcion": "Operacion exitosa",
        "folio": "119201792614241160"
      
    }),
  };
};