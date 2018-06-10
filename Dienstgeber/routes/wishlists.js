/************************************************************************
 * Init-Modules
 ************************************************************************/

//init firestore module
const ADMIN = require("firebase-admin");
const DB = ADMIN.firestore();

//init express module
var express = require("express");
var router = express.Router(null);

const ROUTE = "wishlists";

/************************************************************************
 * Main
 ************************************************************************/

//GET-------------------------------------------------------------------

// gebe alle Wunschlisten eines Events aus
router.get('/', function (req, res) {
    getCollectionAsJSON(ROUTE).then(result => res.json(result));
});

// gebe die Wunschlisten für ein Event von einem User aus

router.get('/:uid', function (req, res) {
    getCollectionAsJSON(ROUTE).then(result => res.json(result));
});

//PUT-------------------------------------------------------------------

// ändere die Wunschlisten für ein Event von einem User

router.put('/:uid' ,function (req, res) {

});

//Export as Module -----------------------------------------------------
module.exports = router;