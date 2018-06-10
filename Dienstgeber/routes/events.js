/************************************************************************
 * Init-Modules
 ************************************************************************/

//init firestore module
const ADMIN = require("firebase-admin");
const DB = ADMIN.firestore();

//init express module
var express = require("express");
var router = express.Router(null);

const ROUTE = "events";

//POST-------------------------------------------------------------------
router.post('/', function (req, res) {

    var event = req.body //JSON in Body

    //POST them in Firebase
    var id = getIdInCollection(ROUTE);
    DB.collection(ROUTE).doc(id).set(event);

    //Send the URI of new event
    var uri = "http://localhost:3000/" + ROUTE + "/" + id;
    res.set('location',uri);
    res.json(event);
});

//GET-------------------------------------------------------------------
router.get('/', function (req, res) {
    getCollectionAsJSON(ROUTE).then(result => res.json(result));
});

router.get('/:uid' ,function (req, res) {
    var eventID = req.params.uid;
    getDokumentAsJSON(ROUTE, eventID).then(result => res.json(result));
});

//PUT-------------------------------------------------------------------
router.put('/:uid' ,function (req, res) {
    var eventID = req.params.uid;
    var newEvent = req.body;

    getDokumentAsJSON(ROUTE, eventID).then(result =>{

            DB.collection(ROUTE).doc(eventID).set(newEvent);
            res.send('Event: ' +eventID+'\n\nwas set from: ' + JSON.stringify(result) +'\nto: ' + JSON.stringify(newEvent));
        }
    );
});

//DELETE----------------------------------------------------------------
router.delete('/:uid' ,function (req, res) {
    var eventID = req.params.uid;
    DB.collection(ROUTE).doc(eventID).delete();
    res.send(eventID+' was deleted');
});

//Export as Module
module.exports = router;

/************************************************************************
 * Functions
 ************************************************************************/

function getCollectionAsJSON(collectionName) {
    return new Promise(function (resolve) {
        var json = {};

        var collection = DB.collection(collectionName);
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

function getIdInCollection(collectionName) {
    var ref = DB.collection(collectionName).doc();
    var id = ref.id;

    return id;
}

function getDokumentAsJSON(collectionName,docName) {
    return new Promise(function (resolve) {
        var json = {};

        var document = DB.collection(collectionName).doc(docName);
        document.get()
            .then(doc => {
                json = doc.data();

            }).then(function () {
            resolve(json);
        });
    });
}