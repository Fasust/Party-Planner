/* WBA2 Gruppe Sebastian Faust, Arthur Tissen, Julian Schoemaker */

/************************************************************************
 * Load modules
 ************************************************************************/

//Express
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

const PORT = 4000;

/************************************************************************
 * Main
 ************************************************************************/

initExpress();
expressExampels();

/************************************************************************
 * Functions
 ************************************************************************/
function initExpress() {

    app.listen(PORT, function () {
        console.log('--Listening on port 3000--');
    });

    //Error Handler
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    //Log
    app.use(function(req, res, next) {
        console.log("Time: \t" + Date.now() + "\t| Request-path:\t" + req.path);
        next();
    });
}
function expressExampels() {

    app.get('/', function (req, res) {
        res.send('Hello World!');
    });

    app.post('/', function (req, res) {
        res.send('Got a POST request');
    });

}
