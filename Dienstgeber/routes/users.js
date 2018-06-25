/************************************************************************
 * Load modules
 ************************************************************************/

//firestore
const admin = require("firebase-admin");
const db = admin.firestore();

//Express
const express = require('express');
const router = express.Router(null);

const ROUTE = "users";

/************************************************************************
 * Main
 ************************************************************************/

//POST-------------------------------------------------------------------
router.post('/', function (req, res) {

    let user = req.body //JSON in Body

    //POST them in Firebase
    let id = getIdInCollection(ROUTE);
    db.collection(ROUTE).doc(id).set(user);

    //Send the URI of new User
    let uri = "http://localhost:3000/" + ROUTE + "/" + id;

    res.set('location',uri);
    res.json(user);
});

//GET-------------------------------------------------------------------
router.get('/', function (req, res) {
    getCollectionAsJSON(ROUTE).then(result => res.json(result));
});
router.get('/:uid' ,function (req, res) {
    let userId = req.params.uid;
    getDokumentAsJSON(ROUTE,userId).then(result => res.json(result));
});

//PUT-------------------------------------------------------------------
router.put('/:uid' ,function (req, res) {
    let userId = req.params.uid;
    let newUser = req.body;

    getDokumentAsJSON(ROUTE,userId).then(result =>{

            db.collection(ROUTE).doc(userId).set(newUser);
            res.send('User: ' +userId+'\n\nwas set from: ' + JSON.stringify(result) +'\nto: ' + JSON.stringify(newUser));
        }
    );

});

//DELETE----------------------------------------------------------------
router.delete('/:uid' ,function (req, res) {
    let userId = req.params.uid;
    db.collection(ROUTE).doc(userId).delete();
    res.send(userId+' was deleted');
});

//Export as Module
module.exports = router;

/************************************************************************
 * Functions
 ************************************************************************/

function getIdInCollection(collectionName) {
    let ref = db.collection(collectionName).doc();
    let id = ref.id;

    return id;
}
function getCollectionAsJSON(collectionName) {
    return new Promise(function (resolve) {
        let json = {};

        let collection = db.collection(collectionName);
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
        let json = {};

        let document = db.collection(collectionName).doc(docName);
        document.get()
            .then(doc => {
                json = doc.data();

            }).then(function () {
                resolve(json);
            });
    });
}
