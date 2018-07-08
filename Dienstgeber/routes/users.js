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

