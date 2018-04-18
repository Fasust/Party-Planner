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

/************************************************************************
 * Main
 ************************************************************************/

DB.collection("cities").doc("LA").set({
    name: "Los Angeles",
    state: "CA",
    country: "USA"
});

DB.collection("cities").doc("SF").set({
    name: "San Francisco",
    state: "CA",
    country: "USA"
});

/************************************************************************
 * Functions
 ************************************************************************/
