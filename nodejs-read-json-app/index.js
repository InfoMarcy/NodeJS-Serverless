'use strict';

const fs = require('fs');

let rawdata = fs.readFileSync('api-data.json');  
let apiJsonData = JSON.parse(rawdata);  
console.log(apiJsonData);  



let student = {  
    name: 'Mike',
    age: 23, 
    gender: 'Male',
    department: 'English',
    car: 'Honda' 
};

let data = JSON.stringify(apiJsonData);  
fs.writeFileSync('./model/data-model.js', data);  