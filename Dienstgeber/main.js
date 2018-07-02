/* WBA2 Gruppe Sebastian Faust, Arthur Tissen, Julian Schoemaker */
//to push subtree to heroku: "subtree push --prefix Dienstgeber heroku master"
/************************************************************************
 * Load modules
 ************************************************************************/

// Init Firestore
const admin = require("firebase-admin");
const serviceAccount = require("./wba2ftsKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wba2fts.firebaseio.com"
});
const db = admin.firestore();

// Init Express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

const PORT = process.env.PORT || 3000;

// Init Route
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
setRoutes();

/************************************************************************
 * Functions
 ************************************************************************/
/**
 * Initialize Express: Listen on Port, Init Log, init Error Handling
 */
function initExpress() {

    app.listen(PORT, function () {
        console.log('--Listening on port 3000--');
    });

    // Error Handler
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    // Log with Timestamp and Request Path
    app.use(function(req, res, next) {
        console.log("Time: \t" + Date.now() + "\t| Request-path:\t" + req.path);
        next();
    });
}
/**
 * Set Express Routes Users and Events
 */
function setRoutes() {
    app.use('/users',usersRouter);
    app.use('/events',eventsRouter);
}