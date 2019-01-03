const fs = require('fs');
const path = require('path');


module.exports = function(cb) {
  // get the path of the json file that we are going to user
  const p = path.join(
    path.dirname(process.mainModule.filename),
    "db",
    "usuarios.json"
  );

  // read the file
  fs.readFile(p, (err, fileContent) => {
    if (err) {
    return  cb([]);
    } else {
        cb(JSON.parse(fileContent));
    }
   
  });
};
