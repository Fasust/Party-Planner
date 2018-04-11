
var fs = require('fs');
var chalk = require('chalk');

fs.readFile(__dirname+'/Tasks/staedte.json', function(err, data) {
    if (err) throw err;

    var citJSON = JSON.parse(data);
    sortCities(citJSON);


    fs.writeFile(__dirname+'/Tasks/staedte_sorted.json', JSON.stringify(citJSON), function(err) {

        printCities(citJSON);

    });

    console.log("JSON Parsed");

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

    return cit;
}

function sortCities(citJSON) {
    citJSON.cities.sort(function (a, b) {
        if (a.population > b.population) {
            return 1;
        }
        if (a.population < b.population) {
            return -1;
        }
        // a muss gleich b sein
        return 0;
    });
}
