/************************************************************************
 * Init modules
 ************************************************************************/

// Init Firestore
const admin = require("firebase-admin");
const db = admin.firestore();

// Init Express
const express = require('express');
const router = express.Router(null);

//Own
const fsExtensions = require('../own_modules/firestoreExtensions');

// Init Route
const ROUTE = "users";

/************************************************************************
 * Main
 ************************************************************************/

/**
 * Users POST: register a user into the Partyplaner application
 */
router.post('/', function (req, res) {

    let user = req.body; //JSON in Body

    //POST them in Firebase
    let id = fsExtensions.getIdInCollection(ROUTE);

    //add subdomains to user
    let userEventURI = req.protocol + '://' + req.get('host') + req.originalUrl + "/" + id + "/events";
    user.navigation = {
        "events" : userEventURI
    };

    db.collection(ROUTE).doc(id).set(user);

    //Send the URI of new User
    let userURI = req.protocol + '://' + req.get('host') + req.originalUrl + "/" +id;

    res.set('location',userURI);
    res.status(201);
    res.json(user);
});

/**
 * Users GET: get all users of the Partyplaner application
 */
router.get('/', function (req, res) {
    fsExtensions.getCollectionAsJSON(ROUTE).then(result => res.json(result));
});

/**
 * Users GET: get a user of the Partyplaner application
 */
router.get('/:uid' ,function (req, res) {
    let userId = req.params.uid;
    fsExtensions.getDokumentAsJSON(ROUTE,userId).then(result => res.json(result));
});

/**
 * Users GET: get all events of the user in the Partyplaner application
 */
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

/**
 * Users PUT: overwrite a user of the Partyplaner application
 */
router.put('/:uid' ,function (req, res) {
    let userId = req.params.uid;
    let newUser = req.body;

    db.collection(ROUTE).doc(userId).set(newUser);
    fsExtensions.getDokumentAsJSON(ROUTE,userId).then(result => res.json(result));
});

/**
 * Users DELETE: delete a user of the Partyplaner application
 */
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
 * Unused Methode
 * that could technically be used to querry sub collections from firestore
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
