"use strict";
console.log("starting functions");

const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.bancadigital = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Bienvenidos al Portal de Apis de Banca Digital",
      input: event
    })
  };
};

function createResponse(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.saveItem = async (event, context) => {
  var params = {
    Item: {
      id: "12345567890",
      date: Date.now(),
      message: "Its working"
    },
    TableName: "bancadigital_tb"
  };

  return docClient
    .put(params)
    .promise()
    .then(() => {
      return createResponse(201, params.Item);
    })
    .catch(ex => {
      return createResponse(500, ex);
    });
};

module.exports.getItem = async (event, context) => {
  const id = event.pathParameters.id;
  console.log(id);

  const params = {
    Key: {
      id: id
    },
    TableName: "bancadigital_tb"
  };

  return docClient
    .get(params)
    .promise()
    .then(res => {
      return createResponse(200, res.Item);
    })
    .catch(ex => {
      return createResponse(500, ex);
    });
};
