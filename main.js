/* WBA2 Gruppe Sebastian Faust, Arthur Tissen, Julian Schoemaker */

/************************************************************************
 * Load modules
 ************************************************************************/

var FS_MOD = require('fs');
var admin = require("firebase-admin");

var serviceAccount = require("/wba2fts-firebase-admin.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wba2fts.firebaseio.com"
});

/************************************************************************
 * Main
 ************************************************************************/


/************************************************************************
 * Functions
 ************************************************************************/
