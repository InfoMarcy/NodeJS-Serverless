//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("oAuth2");
const request = require('request')

module.exports = {
  logUser: function(cred) {
    // Set the headers
    const headers = {
      'Content-Type': 'application/json'
    };

    // Configure the request
    const options = {
      uri: "http://localhost:3333/oauth/authenticate",
      headers: headers,
      form: cred
    };

      request.post(options, (error, res, body) => {
      if (error) {
        console.error(error)
        return 
      }
      console.log(`statusCode: ${res.statusCode}`)
      console.log(body)

      if(res.statusCode == 200){
      return body;
      }
     
    });





  }
};