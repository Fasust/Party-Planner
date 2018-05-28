/* WBA2 Gruppe Sebastian Faust, Arthur Tissen, Julian Schoemaker */

/************************************************************************
 * Load modules
 ************************************************************************/

var FS_MOD = require('fs');
var ADMIN_MOD = require("firebase-admin");

var serviceAccount = require("./wba2ftsKey.json");

ADMIN_MOD.initializeApp({
    credential: ADMIN_MOD.credential.cert(serviceAccount),
    databaseURL: "https://wba2fts.firebaseio.com"
});

var DB = ADMIN_MOD.firestore();

var express = require('express');
var app = express();

/************************************************************************
 * Main
 ************************************************************************/
app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});


app.post('/', function (req, res) {
    res.send('Got a POST request');
});

app.put('/user', function (req, res) {
    res.send('Got a PUT request at /user');
});

app.delete('/user', function (req, res) {
    res.send('Got a DELETE request at /user');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

/*
DB.collection("cities").doc("LA").set({
    name: "Los Angeles",
    state: "CA",
    country: "USA"
});

DB.collection("cities").doc("MIA").set({
    name: "Miami",
    state: "Florida",
    country: "USA"
});

DB.collection("cities").doc("SF").set({
    name: "San Francisco",
    state: "CA",
    country: "USA"
});
*/
/************************************************************************
 * Functions
 ************************************************************************/
