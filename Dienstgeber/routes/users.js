/************************************************************************
 * Load modules
 ************************************************************************/

//firestore
const admin = require("firebase-admin");
const db = admin.firestore();

//Express
var express = require('express');
var router = express.Router(null);

const ROUTE = "users";

/************************************************************************
 * Main
 ************************************************************************/

//GET
router.get('/', function (req, res) {
    getCollectionAsJSON(ROUTE).then(result => res.json(result));
});
router.get('/:uid' ,function (req, res) {
    var userId = req.params.uid;
    getDokumentAsJSON(ROUTE,userId).then(result => res.json(result));
});

//POST
router.post('/', function (req, res) {
    //get JSON atributes from req
    var user_name = req.body.name;

    //build them into a JSON
    var user = {
        name : user_name
    }

    //POST them in Firebase
    var id = getIdInCollection(ROUTE);
    db.collection(ROUTE).doc(id).set(user);

    //Send the URI of new User
    var uri = "http://localhost:3000/" + ROUTE + "/" + id;
    res.set('location',uri);
    res.json(user);
});

//Export as Module
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
