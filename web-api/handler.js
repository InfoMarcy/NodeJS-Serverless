'use strict';
// initialize connection
const db = require('./db');
const uuidv1 = require('uuid/v1');

function createResponse(statusCode, message){
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  }
}


module.exports.saveItem = async (event, context) => {
  const item = JSON.parse(event.body);
  console.log(item);
  item.id = uuidv1();

  db.saveItem(item).then( res => {
    console.log(res);
    return createResponse(200, res);
  });

};

module.exports.getItem = async (event) => {
  const id = event.pathParameters.id;
  console.log(id);
  
   db.getItem(id).then( res => {
    console.log(res);
    return createResponse(200, res);
  });
  }

  module.exports.deleteItem = async (event) => {
    const id = event.pathParameters.id;
    console.log(id);
    
     db.deleteItem(id).then( res => {
      console.log(res);
      return createResponse(200, 'Item was deleted');
    });
    }


    module.exports.updateItem = async (event) => {
      const id = event.pathParameters.id;

      const body = JSON.parse(event.body);
      const paramName = body.paramName;
      const paramValue = body.paramValue;

      
       db.updateItem(id, paramName, paramValue).then( res => {
        console.log(res);
        return createResponse(200, res);
      });
      }
