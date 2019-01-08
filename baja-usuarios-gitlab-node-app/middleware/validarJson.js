const https = require("https");
module.exports = {

    getJson: function (options, cb) {
        https
          .request(options, function(res) {
            var body = "";
      
            res.on("data", function(getData) {
              body += getData;
            });
      
            res.on("end", function() {
              let usuario = JSON.parse(body);
              cb(null, usuario);
            });
            res.on("error", cb);
          })
          .on("error", cb)
          .end();
      },

      // Verify that the return json is not empty
      isEmptyObject: function (obj) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
          }
        }
        return true;
      }

}
