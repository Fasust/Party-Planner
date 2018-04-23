/* WBA2 Gruppe Sebastian Faust, Arthur Tissen, Julian Schoemaker */

/************************************************************************
 * Load Moduls
 ************************************************************************/

var FS_MOD = require('fs');
var CHALK_MOD = require('chalk');


/************************************************************************
 * Main
 ************************************************************************/

// inner functions will be executed after reading this file
FS_MOD.readFile(__dirname+'/Tasks/Task1/staedte.json', function(err, data) {
    if (err) throw err;

    // parse the ANY-object into a JSON-object to work with it
    var cit_JSON = JSON.parse(data);
    var cit_STR;

    // sorting function
    sortCities(cit_JSON);

    //convert JSON-obj to String
    cit_STR = JSON.stringify(cit_JSON);

    // function will be executed after writing the new JSON file
    FS_MOD.writeFile(__dirname+'/Tasks/Task1/staedte_sorted.json',
        cit_STR,
        function(err) {

        // display the cities with their name, country and population
        printCities(cit_JSON);
    });

});

// Check if the asynchronous code is running after reading the whole file
console.log("\nAsynchrones sollte hier nach kommen:\n\n");


/************************************************************************
 * Functions
 ************************************************************************/

/**
 * Prints out City in Console
 * @param cit_JSON needs cities as JSON-obj
 */
function printCities(cit_JSON) {
    for(var i = 0; i < cit_JSON.cities.length; i++){
        // chalk.<color>() for coloring the font

        console.log(CHALK_MOD.blue("name:          " + cit_JSON.cities[i].name));
        console.log(CHALK_MOD.red("country:       " + cit_JSON.cities[i].country));
        console.log(CHALK_MOD.green("population:    " + formatNumberToGerman(cit_JSON.cities[i].population)));
        console.log("-----------------------------");
    }
}

/**
 * Sorting function - sorted by 'population'
 * @param cit_JSON cities as JSON-obj
 */
function sortCities(cit_JSON) {
    cit_JSON.cities.sort(function (a, b) {
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

/**
 * Formats number to german number (100000 -> 100.000)
 * @param numb_INT Number to convert
 * @returns {string} converted number
 */
function formatNumberToGerman(numb_INT) {
    return numb_INT.toLocaleString('de-DE');
}
