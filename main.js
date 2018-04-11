/* WBA2 Gruppe Sebastian Faust, Arthur Tissen, Julian Schoemaker */

// load modules
var fs = require('fs');
var chalk = require('chalk');

// function will be executed after reading this file
fs.readFile(__dirname+'/Tasks/staedte.json', function(err, data) {
    if (err) throw err;

    // parse the JSON into a javascript object to work with it
    var citJSON = JSON.parse(data);

    // sorting function
    sortCities(citJSON);

    // function will be executed after writing the new JSON file
    fs.writeFile(__dirname+'/Tasks/staedte_sorted.json', JSON.stringify(citJSON), function(err) {

        // display the cities with their name, country and population
        printCities(citJSON);
    });

});

// Check if the asynchronous code is running after reading the whole file
console.log("\nAsynchrones sollte hier nach kommen:\n\n");


/************************************************************************
 * Functions
 ************************************************************************/

// print all cities from the object
function printCities(cit) {
    for(var i = 0; i < cit.cities.length; i++){
        // chalk.<color>() for coloring the font
        console.log(chalk.blue("name:          " + cit.cities[i].name));
        console.log(chalk.red("country:       " + cit.cities[i].country));
        console.log(chalk.green("population:    " + cit.cities[i].population));
        console.log("-----------------------------");
    }
}

// Sorting function - sorted by 'population'
function sortCities(citJSON) {
    citJSON.cities.sort(function (a, b) {
        if (a.population > b.population) {
            return 1;
        }
        if (a.population < b.population) {
            return -1;
        }
        // if a is the same as b
        return 0;
    });
}
