"use strict";
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.ITEMS_DYNAMO_TABLE;



module.exports.saveItem = async item => {
  const params = {
    TableName: TABLE_NAME,
    Item: item
  };
  return dynamo
    .put(params)
    .promise()
    .then(() => {
      return  item.id;
    })
    .catch( ex => {
      return  ex;
    });
};



module.exports.getItem = async id => {
  const params = {
    Key: {
     id: id  
    },
    TableName: TABLE_NAME
 };
  

 return dynamo
   .get(params)
   .promise()
   .then( res => {
     return res.Item;
   })
   .catch( ex => {
    return   ex;
   });

  }


  module.exports.deleteItem = async id => {
    const params = {
       Key: {
        id: id  
       },
       TableName: TABLE_NAME
    };
  
    return dynamo
      .delete(params)
      .promise();
  };

  module.exports.updateItem = async (id, paramsName, paramsValue) => {
    const params = {
        TableName: TABLE_NAME, 
       Key: {
        id  
       },
       CondtionExpression: 'attribute_exists(id)',
       UpdateExpression: 'set ' + paramsName + ' = :v',
       ExpressionAttributeValues: {
           ':v': paramsValue
       },
       ReturnsValues: 'ALL_NEW'
    };
  
    return dynamo
      .update(params)
      .promise()
      .then( res => {
        return res.Attributes;
      });
  };

