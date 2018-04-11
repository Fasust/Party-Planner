console.log("Test test");

var fs = require('fs');

var staedte = fs.readFile(__dirname+"/staedte.json", function (err,data) {});

console.log(JSON.stringify(staedte));
/*
fs.writeFile(__dirname+"/staedte.json",data ,function(err){

});
*/
