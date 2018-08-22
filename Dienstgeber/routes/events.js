/************************************************************************
 * Init modules
 ************************************************************************/

// Init Firestore
const admin = require("firebase-admin");
const db = admin.firestore();

// Init Express
const express = require("express");
const router = express.Router(null);

//Faye
const faye = require('faye');

//Own
const fsExtensions = require('../own_modules/firestoreExtensions');

// Validation with JSON Schema
const Validator = require('jsonschema').Validator;
const v = new Validator();

// loading JSON Schema File
const fs = require("fs");
const schema = JSON.parse(fs.readFileSync('./json_schema_wish.json','utf8'));


// Init Route
const ROUTE = "events";
const ROUTE_WISH = "wishes";
const ROUTE_SHOP = "shoppinglist";
const ROUTE_USER = "users";

/************************************************************************
 * Events
 ************************************************************************/

/**
 * Events POST: create an event
 */
router.post('/', function (req, res) {

    // Error handler - start
    if(req.body == {}) {
        res.status(400).send('Missing Body in this POST!');
        return;
    }
   if(!req.body.hasOwnProperty('name')){
        res.status(400).send('Missing Variable in Body of this POST!');
        return;
    }
    // Error handler - end

    // Getting return values
    let event = req.body; //JSON in Body

    let eventID = fsExtensions.getIdInCollection(ROUTE);

    //Adding Links to child domains
    let wishUri = req.protocol + '://' + req.get('host') + req.originalUrl + "/"+ eventID + "/wishes";
    let shoppingUri = req.protocol + '://' + req.get('host') + req.originalUrl + "/"+ eventID + "/shoppinglist";
    let userUri = req.protocol + '://' + req.get('host') + req.originalUrl + "/"+ eventID + "/users";
    event.links = {
        "users" : userUri,
        "shoppinglist" : shoppingUri,
        "wishes" : wishUri
    };


    // POST it in Firebase
    db.collection(ROUTE).doc(eventID).set(event);

    // Send the URI of new event
    let uri = req.protocol + '://' + req.get('host') + req.originalUrl + "/" + eventID;
    res.set('location',uri);
    res.status(201);
    res.json(event);
});

/**
 * Events GET: get all events
 */
router.get('/', function (req, res) {
    fsExtensions.getCollectionAsJSON(ROUTE).then(result => res.json(result));
});

/**
 * Events GET: get an event
 */
router.get('/:eid' ,function (req, res) {
    // Getting return values
    let eventID = req.params.eid;

    fsExtensions.getDokumentAsJSON(ROUTE, eventID).then(result => res.json(result));
});

/**
 * Events PUT: overwrite an event
 */
router.put('/:eid' ,function (req, res) {

    // Error handler - start
    if(req.body == {}) {
        res.status(400).send('Missing Body in this PUT!');
        return;
    }
    if(!req.body.hasOwnProperty('name')){
        res.status(400).send('Missing Variable in Body of this POST!');
        return;
    }
    // Error handler - end

    // Getting return values
    let eventID = req.params.eid;
    let newEvent = req.body;

    db.collection(ROUTE).doc(eventID).set(newEvent);
    fsExtensions.getDokumentAsJSON(ROUTE, eventID).then(result => res.json(result));
});

/**
 * Events DELETE: delete an event
 */
router.delete('/:eid' ,function (req, res) {
    // Getting return values
    let eventID = req.params.eid;

    db.collection(ROUTE).doc(eventID).delete();
    res.send(eventID+' was deleted');
});

/************************************************************************
 * Wishes
 ************************************************************************/

/**
 * Wishes GET: get all wishes from event
 */
router.get('/:eid/wishes', function (req, res) {
    // Getting return values
    let eventID = req.params.eid;

    fsExtensions.getCollectionAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_WISH).then(result => res.json(result));

});

/**
 * Wishes GET: get a wish from event
 */
router.get('/:eid/wishes/:wid', function (req, res) {
    // Getting return values
    let eventID = req.params.eid;
    let wishID = req.params.wid;

    fsExtensions.getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_WISH, wishID).then(result => res.json(result));
});

/**
 * Wishes POST: post a wish for an event
 */
router.post('/:eid/wishes', function (req, res) {

    // Validation - start-----------------------
    if(req.body == {}) {
        res.status(400).send('Missing Body in this POST!');
        return;
    }
    if(!req.body.hasOwnProperty('user')){
        res.status(400).send('Missing Variable in Body of this POST!');
        return;
    }
    if(!req.body.hasOwnProperty('location')){
        res.status(400).send('Missing Variable in Body of this POST!');
        return;
    }
    if(!req.body.hasOwnProperty('name')){
        res.status(400).send('Missing Variable in Body of this POST!');
        return;
    }
    //JSON Schema
    if ( v.validate(req.body, schema).errors.length > 0 ) {
        res.status(400).send('JSON Schema Validation failed. Maybe location and name are not type String.');
        return;
    }
    // Validation - end-------------------

    //Check if a shopping list has already been generated
    db.collection('events').doc(req.params.eid).collection('shoppinglist').get().
    then(shop => {
        if (shop.docs.length > 0) {

            //Shopping List exists
            res.status(423).send('Shoppinglist was already generated: No Longer Allowed to Submit Wishes.');

        }else{
            //Shopping List Dose Not exist

            // Getting return values
            let wish = req.body; //JSON in Body
            let userID = wish.user;
            let eventID = req.params.eid;
            let wishID = fsExtensions.getIdInCollection(ROUTE + "/" + eventID + "/" + ROUTE_WISH);

            //Change User ID to URI
            let userURI = req.protocol + '://' + req.get('host') +"/users/" + userID;
            wish.user = userURI;

            // POST it in Firebase
            db.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).doc(wishID).set(wish);

            // Send the URI of new event
            let uri = req.protocol + '://' + req.get('host')+ req.originalUrl +"/" + wishID;
            res.set('location',uri);
            res.status(201);
            res.json(wish);

        }
    });
});

/**
 * Wishes PUT: overwrite a wish for an event
 */
router.put('/:eid/wishes/:wid' ,function (req, res) {

    // Validation - start
    if(req.body == {}) {
        res.status(400).send('Missing Body in this POST!');
        return;
    }
    if(!req.body.hasOwnProperty('user')){
        res.status(400).send('Missing Variable in Body of this POST!');
        return;
    }
    if(!req.body.hasOwnProperty('location')){
        res.status(400).send('Missing Variable in Body of this POST!');
        return;
    }
    if(!req.body.hasOwnProperty('name')){
        res.status(400).send('Missing Variable in Body of this POST!');
        return;
    }
    //JSON Schema
    if ( v.validate(req.body, schema).errors.length > 0 ) {
        res.status(400).send('JSON Schema Validation failed. Maybe location and name are not type String.');
        return;
    }
    // Validation - end

    //Check if a shopping list has already been generated
    db.collection('events').doc(req.params.eid).collection('shoppinglist').get().
    then(shop => {
        if (shop.docs.length > 0) {

            //Shopping List exists
            res.status(423).send('Shoppinglist was already generated: No Longer Allowed to Change Wishes.');

        }else{
            //Shoppinglist dose not Exist

            // Getting return values
            let eventID = req.params.eid;
            let wishID = req.params.wid;
            let newWish = req.body;
            let userID = newWish.user;

            //Change User ID to URI
            let userURI = req.protocol + '://' + req.get('host') +"/users/" + userID;
            newWish.user = userURI;

            db.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).doc(wishID).set(newWish);
            fsExtensions.getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_WISH, wishID).then(result => res.json(result));
        }
    });
});

/**
 * Wishes DELETE: delete a wish for an event
 */
router.delete('/:eid/wishes/:wid' ,function (req, res) {
    // Getting return values
    let eventID = req.params.eid;
    let wishID = req.params.wid;

    db.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).doc(wishID).delete();
    res.send(wishID + ' was deleted');
});

/************************************************************************
 * Users (in an event)
 ************************************************************************/

/**
 * Users (in an event) GET: get all users of an event
 */
router.get('/:eid/users', function (req, res) {
    // Getting return values
    let eventID = req.params.eid;

    fsExtensions.getCollectionAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_USER).then(result => res.json(result));
});

/**
 * Users (in an event) GET: get one user of an event
 */
router.get('/:eid/users/:uid', function (req, res) {
    // Getting return values
    let eventID = req.params.eid;
    let userID = req.params.uid;

    fsExtensions.getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_USER, userID).then(result => res.json(result));
});

/**
 * Users (in an event) POST: create a user of an event
 */
router.post('/:eid/users', function (req, res) {

    // Error handler - start
    if(req.body == {}) {
        res.status(400).send('Missing Body in this POST!');
        return;
    }
    if(!req.body.hasOwnProperty('user')){
        res.status(400).send('Missing Variable in Body of this POST!');
        return;
    }

    // Error handler - end

    // Getting return values
    let user = req.body; //JSON in Body
    let userID = user.user;
    let eventID = req.params.eid;

    let uri = req.protocol + '://' + req.get('host') + "/users/" + userID;

    //Chage User ID to URI
    user.user = uri;

    // POST it in Firebase
    db.collection(ROUTE).doc(eventID).collection(ROUTE_USER).doc(userID).set(user);

    //Saving User in Event Document
    //This Thechnically not Restconform, but a neccecarity, due to firestores lack of complex querrys (See Documentation for more details)
    db.collection('events').doc(eventID).update({
        ['users.'+userID]: uri
    });

    // Send the URI of new event
    res.set('location',uri);
    res.status(201);
    res.json(user);
});

/**
 * Users (in an event) PUT: overwrite a user of an event
 */
router.put('/:eid/users/:uid' ,function (req, res) {

    // Error handler - start
    if(req.body == {}) {
        res.status(400).send('Missing Body in this PUT!');
        return;
    }
    if(!req.body.hasOwnProperty('user')){
        res.status(400).send('Missing Variable in Body of this POST!');
        return;
    }
    // Error handler - end

    // Getting return values
    let eventID = req.params.eid;
    let userID = req.params.uid;
    let newUser = req.body;

    let userUri = req.protocol + '://' + req.get('host') + "/users/" + userID;

    //Change UserID to URI
    newUser.user = userID;

    db.collection(ROUTE).doc(eventID).collection(ROUTE_USER).doc(userID).set(newUser);

    //Saving User in Event Document
    //This Thechnically not Restconform, but a neccecarity, due to firestores lack of complex querrys (See Documentation for more details)
    db.collection('events').doc(eventID).update({
        ['users.'+userID]: userUri
    });
    fsExtensions.getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_USER, userID).then(result => res.json(result));
});

/**
 * Users (in an event) DELETE: delete a user of an event
 */
router.delete('/:eid/users/:uid' ,function (req, res) {
    // Getting return values
    let eventID = req.params.eid;
    let userID = req.params.uid;

    //Removing User from Event Document
    //This Thechnically not Restconform, but a neccecarity, due to firestores lack of complex querrys (See Documentation for more details)
    fsExtensions.getDokumentAsJSON(ROUTE, eventID).then(event =>{
        delete event.users[userID];
        db.collection(ROUTE).doc(eventID).set(event);
    });

    db.collection(ROUTE).doc(eventID).collection(ROUTE_USER).doc(userID).delete();
    res.send(userID+' was removed from Event: ' + eventID);
});


/************************************************************************
 * Soppinglist
 ************************************************************************/

/**
 * Shoppinglist GET: get the shoppinglist of an event
 */
router.get('/:eid/shoppinglist', function (req, res) {
    // Getting return values
    let eventID = req.params.eid;

    fsExtensions.getCollectionAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_SHOP).then(result => res.json(result));
});

/**
 * Shoppinglist GET: get one item of the shoppinglist of an event
 */
router.get('/:eid/shoppinglist/:sid', function (req, res) {
    // Getting return values
    let eventID = req.params.eid;
    let itemID = req.params.sid;

    fsExtensions.getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_SHOP, itemID).then(result => res.json(result));
});

/**
 * This is where the matching happens
 When posting on events/(id)/shoppinglist we automatically match all wishes to the users that are part of this event.
 With this all users have the option to the their lists and know where to buy the items
 */
router.post('/:eid/shoppinglist', function (req, res) {
    // Getting return values
    let eventID = req.params.eid;

    // Error handler - start
    fsExtensions.checkIfDocInCollection(ROUTE,eventID).then(function (result) {
        if (result == false) {
            res.status(400).send('Event ID does not exist!');
            return;
        }
    });
    // Error handler - end

    //GET all WISHES in EVENT
    let wishCollection = db.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).orderBy('location', 'asc');

    //GET all USERS in EVENT
    let userCollection = db.collection(ROUTE).doc(eventID).collection(ROUTE_USER);

    //Save all User Ids in an Array and Return it
    let userIDs = {};
    new Promise(function (resolve) {
        userCollection.get()
            .then(users => {

                //GET all user Ids in Event
                let userIndex = 0;
                users.forEach(user => {
                    userIDs[userIndex] = user.id;
                    userIndex++;
                });
            }).then(function () {

                resolve(userIDs);
            });
    }).then(function () {

        wishCollection.get()
            .then(wishes => {
                let destribution = JSON.parse(JSON.stringify(userIDs)); //clone UserIDS
                for (let key in destribution){

                    // asinge every user ID a value of 0.
                    // This will be the number of wishes ever user has  at a given Moment
                    destribution[key] = 0;
                }

                let previosLocation = "";
                let currentLocation = "";

                let shoppingList = [];

                let index = 0;

                //Match Wishes by Location
                wishes.forEach(wish => {
                    currentLocation = wish.data().location;
                    if(currentLocation != previosLocation){
                        console.log("---------------------");
                        console.log("location: " + currentLocation);

                        //find index of user with smalles amout of wishes
                        let lowest = 2147483647;
                        for (let key in destribution){

                            if(Number(destribution[key]) < lowest ){
                                lowest = destribution[key];
                                index = key;
                            }
                        }
                    }

                    //Turn Wish and user IDs to URIS
                    let wishURI = req.protocol + '://' + req.get('host') + "/events/" + eventID + "/wishes/" + wish.id;
                    let userURI = req.protocol + '://' + req.get('host') + "/users/"  + userIDs[index];
                    console.log("user: " + userIDs[index]+" -> Was Matched to: " + wish.data().name);

                    //save that this user was assinded a new wish
                    destribution[index] = destribution[index] + 1;

                    //add result to firestore
                    let entry = {
                        "wish" :  wishURI,
                        "user" : userURI
                    };
                    shoppingList.push(entry);

                    db.collection(ROUTE).doc(eventID).collection(ROUTE_SHOP).doc(wish.id).set(entry);
                    previosLocation = currentLocation;
                });
                //Publish on Faye
                let client = new faye.Client(req.protocol + '://' + req.get('host') + '/faye');
                client.publish('/' + eventID, {event: eventID, shoppinglist: shoppingList});

                //Send Result
                res.status(201);
                fsExtensions.getCollectionAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_SHOP).then(result => res.json(result));
            });
    });
});

//Export as Module
module.exports = router;
