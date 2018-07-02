/************************************************************************
 * Init-Modules
 ************************************************************************/

// Init Firestore
const admin = require("firebase-admin");
const db = admin.firestore();

// Init Express
const express = require("express");
const router = express.Router(null);

// Init Route
const ROUTE = "events";
const ROUTE_WISH = "wishes";
const ROUTE_SHOP = "shoppinglist";
const ROUTE_USER = "users";

/************************************************************************
 * Events
 ************************************************************************/

//POST-------------------------------------------------------------------
router.post('/', function (req, res) {

    // Error handler - start
    if(req.body == {}) {
        res.status(400).send('Missing Body in this POST!');
        return;
    }
    // Error handler - end

    // Getting return values
    let event = req.body; //JSON in Body

    let eventID = getIdInCollection(ROUTE);

    //Adding Links to child domains
    let wishUri = req.protocol + '://' + req.get('host') + req.originalUrl + "/"+ eventID + "/wishes";
    let shoppingUri = req.protocol + '://' + req.get('host') + req.originalUrl + "/"+ eventID + "/shoppinglist";
    let userUri = req.protocol + '://' + req.get('host') + req.originalUrl + "/"+ eventID + "/users";
    event.navigation = {
        "users" : userUri,
        "shoppinglist" : shoppingUri,
        "wishes" : wishUri
    };


    // POST it in Firebase
    db.collection(ROUTE).doc(eventID).set(event);

    // Send the URI of new event
    let uri = req.protocol + '://' + req.get('host') + req.originalUrl + "/" + eventID;
    res.set('location',uri);
    res.json(event);
});

//GET-------------------------------------------------------------------
router.get('/', function (req, res) {
    getCollectionAsJSON(ROUTE).then(result => res.json(result));
});

router.get('/:eid' ,function (req, res) {
    // Getting return values
    let eventID = req.params.eid;

    getDokumentAsJSON(ROUTE, eventID).then(result => res.json(result));
});

//PUT-------------------------------------------------------------------
router.put('/:eid' ,function (req, res) {

    // Error handler - start
    if(req.params.eid == null) {
        res.status(400).send('No valid Event ID!');
        return;
    }
    if(req.body == {}) {
        res.status(400).send('Missing Body in this PUT!');
        return;
    }
    // Error handler - end

    // Getting return values
    let eventID = req.params.eid;
    let newEvent = req.body;

    db.collection(ROUTE).doc(eventID).set(newEvent);
    getDokumentAsJSON(ROUTE, eventID).then(result => res.json(result));
});

//DELETE----------------------------------------------------------------
router.delete('/:eid' ,function (req, res) {
    // Getting return values
    let eventID = req.params.eid;

    db.collection(ROUTE).doc(eventID).delete();
    res.send(eventID+' was deleted');
});

/************************************************************************
 * Wishes
 ************************************************************************/

//GET-------------------------------------------------------------------

// gebe alle Wuensche eines Events aus
router.get('/:eid/wishes', function (req, res) {
    // Getting return values
    let eventID = req.params.eid;

    getCollectionAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_WISH).then(result => res.json(result));

});

// gebe einen Wunschn für ein Event áus
router.get('/:eid/wishes/:wid', function (req, res) {
    // Getting return values
    let eventID = req.params.eid;
    let wishID = req.params.wid;

    getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_WISH, wishID).then(result => res.json(result));
});

//POST------------------------------------------------------------------

router.post('/:eid/wishes', function (req, res) {

    // Error handler - start
    if(req.body == {}) {
        res.status(400).send('Missing Body in this POST!');
        return;
    }
    if(req.body.user == null) {
        res.status(400).send('No valid User ID!');
        return;
    }
    if(req.params.eid == null) {
        res.status(400).send('No valid Event ID!');
        return;
    }
    // Error handler - end

    // Getting return values
    let wish = req.body; //JSON in Body
    let userID = wish.user;
    let eventID = req.params.eid;
    let wishID = getIdInCollection(ROUTE + "/" + eventID + "/" + ROUTE_WISH);

    //Change User ID to URI
    let userURI = req.protocol + '://' + req.get('host') +"/users/" + userID;
    wish.user = userURI;

    // POST it in Firebase
    db.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).doc(wishID).set(wish);

    // Send the URI of new event
    let uri = req.protocol + '://' + req.get('host') + req.originalUrl +"/" + wishID;
    res.set('location',uri);
    res.json(wish);
});

//PUT------------------------------------------------------------------
router.put('/:eid/wishes/:wid' ,function (req, res) {

    // Error handler - start
    if(req.body == {}) {
        res.status(400).send('Missing Body in this PUT!');
        return;
    }
    if(req.body.user == null) {
        res.status(400).send('No valid User ID!');
        return;
    }
    if(req.params.eid == null) {
        res.status(400).send('No valid Event ID!');
        return;
    }
    if(req.params.wid == null) {
        res.status(400).send('No valid Wish ID!');
        return;
    }
    // Error handler - end

    // Getting return values
    let eventID = req.params.eid;
    let wishID = req.params.wid;
    let newWish = req.body;
    let userID = newWish.user;

    //Change User ID to URI
    let userURI = req.protocol + '://' + req.get('host') +"/users/" + userID;
    newWish.user = userURI;

    db.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).doc(wishID).set(newWish);
    getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_WISH, wishID).then(result => res.json(result));
});

//DELETE----------------------------------------------------------------
router.delete('/:eid/wishes/:wid' ,function (req, res) {
    // Getting return values
    let eventID = req.params.eid;
    let wishID = req.params.wid;

    db.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).doc(wishID).delete();
    res.send(wishID + ' was deleted');
});

/************************************************************************
 * Users
 ************************************************************************/
//GET-------------------------------------------------------------------

//all users of Event
router.get('/:eid/users', function (req, res) {
    // Getting return values
    let eventID = req.params.eid;

    getCollectionAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_USER).then(result => res.json(result));
});

//One User
router.get('/:eid/users/:uid', function (req, res) {
    // Getting return values
    let eventID = req.params.eid;
    let userID = req.params.uid;

    getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_USER, userID).then(result => res.json(result));
});

//POST------------------------------------------------------------------

router.post('/:eid/users', function (req, res) {

    // Error handler - start
    if(req.body == {}) {
        res.status(400).send('Missing Body in this POST!');
        return;
    }
    if(req.body.user == null) {
        res.status(400).send('No valid User ID!');
        return;
    }
    if(req.params.eid == null) {
        res.status(400).send('No valid Event ID!');
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
    res.json(user);
});

//PUT------------------------------------------------------------------
router.put('/:eid/users/:uid' ,function (req, res) {

    // Error handler - start
    if(req.body == {}) {
        res.status(400).send('Missing Body in this PUT!');
        return;
    }
    if(req.params.uid == null) {
        res.status(400).send('No valid User ID!');
        return;
    }
    if(req.params.eid == null) {
        res.status(400).send('No valid Event ID!');
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
    getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_USER, userID).then(result => res.json(result));
});

//DELETE----------------------------------------------------------------
router.delete('/:eid/users/:uid' ,function (req, res) {
    // Getting return values
    let eventID = req.params.eid;
    let userID = req.params.uid;

    //Removing User from Event Document
    //This Thechnically not Restconform, but a neccecarity, due to firestores lack of complex querrys (See Documentation for more details)
    getDokumentAsJSON(ROUTE, eventID).then(event =>{
        delete event.users[userID];
        db.collection(ROUTE).doc(eventID).set(event);
    });

    db.collection(ROUTE).doc(eventID).collection(ROUTE_USER).doc(userID).delete();
    res.send(userID+' was removed from Event: ' + eventID);
});


/************************************************************************
 * Soppinglist
 ************************************************************************/

//GET-------------------------------------------------------------------
router.get('/:eid/shoppinglist', function (req, res) {
    // Getting return values
    let eventID = req.params.eid;

    getCollectionAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_SHOP).then(result => res.json(result));
});

router.get('/:eid/shoppinglist/:sid', function (req, res) {
    // Getting return values
    let eventID = req.params.eid;
    let itemID = req.params.sid;

    getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_SHOP, itemID).then(result => res.json(result));
});

//POST-------------------------------------------------------------------
/* This Where The Matching Happens.
When Posting on events/(id)/shoppinglist we automatically Match all wishes to the Users that are Part of the Event */
router.post('/:eid/shoppinglist', function (req, res) {
    // Getting return values
    let eventID = req.params.eid;

    // Error handler - start
    checkIfDocInCollection(ROUTE,eventID).then(function (result) {
        if (result == false) {
            res.status(400).send('Event ID does not exist!');
            return;
        }
    });

    if(req.params.eid == null ) {
        res.status(400).send('No valid Event ID!');
        return;
    }
    // Error handler - end


    //GET all WISHES in EVENT
    let wishCollection = db.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).orderBy('location', 'desc');

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
                let previosLocation = "";
                let currentLocation = "";

                let index = -1;

                //Match Wishes by Location
                wishes.forEach(wish => {
                    currentLocation = wish.data().location;
                    if(currentLocation != previosLocation){ // if more locations than users, loop back around
                        if(index >= Object.keys(userIDs).length-1) {
                            console.log("\n> New Iteration");
                            index = 0;
                        }else{
                            index++;
                        }
                        console.log("---------------------");
                        console.log("location: " + currentLocation);
                    }

                    //Turn Wish and user IDs to URIS
                    let wishURI = req.protocol + '://' + req.get('host') + "/events/" + eventID + "/wishes/" + wish.id;
                    let userURI = req.protocol + '://' + req.get('host') + "/users/"  + userIDs[index];
                    console.log("user: " + userIDs[index]+" -> Was Matched to: " + wish.data().name);

                    //add result to firestore
                    let entry = {
                        "wish" :  wishURI,
                        "user" : userURI
                    };
                    /* To show more detail in the POST (is redundant)
                    entry.wish = {
                        "uri": wishURI,
                        "location": wish.data().location,
                        "name": wish.data().name
                    };
                    */
                    db.collection(ROUTE).doc(eventID).collection(ROUTE_SHOP).doc(wish.id).set(entry);
                    previosLocation = currentLocation;
                });
                //Send Result
                getCollectionAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_SHOP).then(result => res.json(result));
            });
    });
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
 * @param docName name of the document
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
 * Returns a Promise that is to be resolved as a boolean that shows us if a ID exists in a collection
 * @param collectionName name of the collection
 * @param docName name of the document
 * @returns {Promise<any>} Promise that resolves as bool
 */
function checkIfDocInCollection(collectionName, docName) {
    return new Promise(function (resolve) {
        // Test for the existence of certain keys within a DataSnapshot;
        db.collection(collectionName).doc(docName).get()
            .then(function(snapshot) {
                let idExists = snapshot.exists;
                resolve(idExists);
            });
    });
}