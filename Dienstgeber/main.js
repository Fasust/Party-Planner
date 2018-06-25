/* WBA2 Gruppe Sebastian Faust, Arthur Tissen, Julian Schoemaker */

/************************************************************************
 * Load modules
 ************************************************************************/

//firestore
const fs = require('fs');
const admin = require("firebase-admin");
const serviceAccount = require("../wba2ftsKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wba2fts.firebaseio.com"
});
const db = admin.firestore();

//Express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

const PORT = 3000;

//Routes
const usersRouter = require('./routes/users');
const eventsRouter = require('./routes/events');

/************************************************************************
 * Faye server
 ************************************************************************/
/*let http = require('http'); //TODO: Faye server konfigurieren(?)
let faye = require('faye');

let server = http.createServer(),
    bayeux = new faye.NodeAdapter({mount: 'faye', timeout:45});


bayeux.attach(server);
server.listen(8000);
console.log("Faye server listening on port 8000");
*/
/************************************************************************
 * Main
 ************************************************************************/

initExpress();
expressExampels();
setRoutes();

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
function setRoutes() {
    app.use('/users',usersRouter);
    app.use('/events',eventsRouter);
}