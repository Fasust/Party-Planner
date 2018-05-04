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
FS_MOD.readFile(__dirname+'/staedte.json', function(err, data1) {
    if (err) throw err;

    FS_MOD.readFile(__dirname+ '/../Task2/mehr_staedte.json', function(err, data2) {
        // parse the ANY-object into a JSON-object to work with it
        var cit_JSON = JSON.parse(data1);
        var cit_STR;

        var cit2_JSON = JSON.parse(data2);

        var citComplete_JSON = cit_JSON.cities.concat(cit2_JSON.cities);

        // sorting function
        sortJSONbyParameter(citComplete_JSON,"population");

        //convert JSON-obj to String
        cit_STR = JSON.stringify(citComplete_JSON);

        // function will be executed after writing the new JSON file
        FS_MOD.writeFile(__dirname+'/staedte_sorted.json',
            cit_STR,
            function(err) {

                // display the cities with their name, country and population
                printCities(citComplete_JSON);
            });
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
    for(var i = 0; i < cit_JSON.length; i++){
        // chalk.<color>() for coloring the font

        console.log(CHALK_MOD.blue("name:          " + cit_JSON[i].name));
        console.log(CHALK_MOD.red("country:       " + cit_JSON[i].country));
        console.log(CHALK_MOD.green("population:    " + formatNumberToGerman(cit_JSON[i].population)));
        console.log("-----------------------------");
    }
}

/**
 * Sort JSON by KEY Atribute
 * @param JSON
 * @param key_STR name of parameter to sort by
 */
function sortJSONbyParameter(JSON,key_STR) {
    JSON.sort(function (a, b) {
        if (a[key_STR] > b[key_STR]) {
            return 1;
        }
        if (a[key_STR] < b[key_STR]) {
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
