'use strict';

module.exports.app = async (event, context) => {
  //const {first, second} = event;
  //const added = first + second;
  console.log(event);
  console.log(event.pathParameters.id);

  const reply = `Hello ${event.pathParameters.id}`;
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: JSON.stringify(reply)
    }),
  };
};