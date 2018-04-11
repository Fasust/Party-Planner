
var fs = require('fs');
var chalk = require('chalk');

fs.readFile(__dirname+'/Tasks/staedte.json', function(err, data) {
    if (err) throw err;

    printCities(JSON.parse(data));
    console.log("JSON Parsed")

});

console.log("Asynchrones sollte hier nach kommen");

/*-----------------Functions--------------------*/

function printCities(cit) {
    for(var i = 0; i < cit.cities.length; i++){
        console.log(chalk.blue("name:          " + cit.cities[i].name));
        console.log(chalk.red("country:       " + cit.cities[i].country));
        console.log(chalk.green("population:    " + cit.cities[i].population));
        console.log("-----------------------------");
    }
}
