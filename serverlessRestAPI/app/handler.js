module.exports.app = (event, context, callback) => {
  callback(null, { statusCode: 200, body: "someone invoked me!" });
};
