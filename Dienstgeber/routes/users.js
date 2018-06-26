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

/*router.get('/:uid/events' ,function (req, res) {
    let userId = req.params.uid;

    db.collection("events").get().then(snapshot => {
        snapshot.forEach(event => {

            db.collection("events").doc(event.id).collection("users").where('id', '==', userId).get().then(snapshot => {
                snapshot.forEach(user => {

                });

        });
    });

    getDokumentAsJSON(ROUTE,userId).then(result => res.json(result));
});
*/
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

/**
 * Returns a unigue ID in a specific collection
 * @param collectionName name of the collection that a id is to be generated for
 * @returns int id unique ID
 */
function getIdInCollection(collectionName) {
    let ref = db.collection(collectionName).doc();
    let id = ref.id;

    return id;
}
/**
 * Returns a Promise that is to be resolved as a JSON and represents a specific collection (GET)
 * @param collectionName naem of the collecetion
 * @returns {Promise<any>} Promise that resolves as JSON
 */
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
/**
 * Returns a Promise that is to be resolved as a JSON and represents a specific document in a collection (GET)
 * @param collectionName name of the collection
 * @param docName name of the documeten
 * @returns {Promise<any>} Promise that resolves as JSON
 */
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
