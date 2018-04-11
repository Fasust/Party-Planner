console.log("Test test");

var fs = require('fs');
fs.readFile(__dirname+'/Tasks/staedte.json', function(err, data) {
    if (err) throw err;

    var staedte = JSON.parse(data);
    console.log(staedte.cities[0].name);
});

console.log("Asynchrones sollte hier nach kommen");


/*
fs.writeFile(__dirname+"/staedte.json",data ,function(err){

});
*/
