/************************************************************************
 * Load modules
 ************************************************************************/

// Init Firestore
const admin = require("firebase-admin");
const db = admin.firestore();

// Init Express
const express = require('express');
const router = express.Router(null);

// Init Route
const ROUTE = "users";

/************************************************************************
 * Main
 ************************************************************************/

//POST------------------------------------------------------------------
router.post('/', function (req, res) {

    let user = req.body; //JSON in Body

    //POST them in Firebase
    let id = getIdInCollection(ROUTE);

    //add subdomains to user
    let userEventURI = req.protocol + '://' + req.get('host') + req.originalUrl +id + "/events";
    user.navigation = {
        "events" : userEventURI
    };

    db.collection(ROUTE).doc(id).set(user);

    //Send the URI of new User
    let userURI = req.protocol + '://' + req.get('host') + req.originalUrl + "/"+id;

    res.set('location',userURI);
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

//Get all events of a user
router.get('/:uid/events' ,function (req, res) {
    let userId = req.params.uid;

    db.collection("events").where('users.'+userId, '>', '').get()
        .then(events => {
            let resJson = {};
            events.forEach(eve => {

                let eventUri= req.protocol + '://' + req.get('host') +  "/events/" + eve.id;
                resJson[eve.id] = eventUri ;
            });
            res.json(resJson);
        });
});

//PUT-------------------------------------------------------------------
router.put('/:uid' ,function (req, res) {
    let userId = req.params.uid;
    let newUser = req.body;

    db.collection(ROUTE).doc(userId).set(newUser);
    getDokumentAsJSON(ROUTE,userId).then(result => res.json(result));
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

/**
 * Unused Methode that could tchnically be used to querry sub collections from firestore
 * We do not use it becouse we deemed th workaround to "dirty".
 * We now use a different, more clean work around (See Wiki)
 * @param collectionName name of the Parent collection to querry from
 * @param subcollectionName name of the child collection to querry from
 * @param nameOfIDAtributeInDoc name of the atribut in the documents of the child collection that conatins the id to querry by
 * @param idToQuerryFor
 * @returns {Promise<any>} returns a promise that is to be resolves as an array off all ids that fit the querry request
 */
function querryInSubcollection(collectionName, subcollectionName, nameOfIDAtributeInDoc, idToQuerryFor) {
   return new Promise(function (resolve) {
       let resultList = [];

       //Get Documents in Parent Collection
       db.collection(collectionName).get().then(parentSnap => {
           parentSnap.forEach(document => {

               //Retrive sub collection of each document
               db.collection(collectionName).doc(document.id).collection(subcollectionName).
               where(nameOfIDAtributeInDoc, '==', idToQuerryFor).get().  //Where the nameOfIDAtributeInDoc is equal to the idToQuerryFor
               then(subDocument => {
                   resultList.push(document.id);
                   console.log(document.id);
               });
           });
       });
       setTimeout(resolve, 5000,resultList);
   });
}
