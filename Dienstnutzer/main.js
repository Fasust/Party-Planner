/* WBA2 Gruppe Sebastian Faust, Arthur Tissen, Julian Schoemaker */

/************************************************************************
 * Load modules
 ************************************************************************/

const request = require('request');
const rp = require('request-promise');

//Express
const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

const PORT = 4000;
const DIENST_GEBER = 'http://localhost:3000';

/************************************************************************
 * Main
 ************************************************************************/

initExpress();

app.get('/', function (req, res) {
    console.log("Recieved GET");

    var options = {
        method: 'GET',
        uri: DIENST_GEBER + '/users',
        json: true // Automatically stringifies the body to JSON
    };
    console.log("Set Options");

    rp(options)
        .then(function (parsedBody) {
            console.log("Responding..."+parsedBody);
            res.json(parsedBody);
        })
        .catch(function (err) {
            // POST failed...
        });
});

/************************************************************************
 * Functions
 ************************************************************************/
function initExpress() {

    app.listen(PORT, function () {
        console.log('--Listening on port 4000--');
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