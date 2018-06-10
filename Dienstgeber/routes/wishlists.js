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

router.get('/:wid', function (req, res) {
    getCollectionAsJSON(ROUTE).then(result => res.json(result));
});

//PUT-------------------------------------------------------------------

// ändere die Wunschlisten für ein Event von einem User

router.put('/:wid' ,function (req, res) {

});

//Export as Module -----------------------------------------------------
module.exports = router;

/************************************************************************
 * Functions
 ************************************************************************/

function getIdInCollection(collectionName) {
    var ref = db.collection(collectionName).doc();
    var id = ref.id;

    return id;
}

function getCollectionAsJSON(collectionName) {
    return new Promise(function (resolve) {
        var json = {};

        var collection = db.collection(collectionName);
        collection.get()
            .then(snapshot => {
                snapshot.forEach(doc => {

                    json[doc.id] = doc.data();
                });
            }).then(function () {
            resolve(json);
        });
    });
}

function getDokumentAsJSON(collectionName,docName) {
    return new Promise(function (resolve) {
        var json = {};

        var document = db.collection(collectionName).doc(docName);
        document.get()
            .then(doc => {
                json = doc.data();

            }).then(function () {
            resolve(json);
        });
    });
}