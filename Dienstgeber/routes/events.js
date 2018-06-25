/************************************************************************
 * Init-Modules
 ************************************************************************/

//init firestore module
const ADMIN = require("firebase-admin");
const DB = ADMIN.firestore();

//init express module
// cn: besser nur const oder let verwenden
const express = require("express");
const router = express.Router(null);

const ROUTE = "events";
const ROUTE_WISH = "wishes";
const ROUTE_SHOP = "shoppinglist";
const ROUTE_USER = "users";

/************************************************************************
 * Events
 ************************************************************************/

//POST-------------------------------------------------------------------
router.post('/', function (req, res) {

    let event = req.body; //JSON in Body

    let eventID = getIdInCollection(ROUTE);

    //POST it in Firebase
    DB.collection(ROUTE).doc(eventID).set(event);

    //Send the URI of new event
    let uri = "http://localhost:3000/" + ROUTE + "/" + eventID;
    res.set('location',uri);
    res.json(event);
});

//GET-------------------------------------------------------------------
router.get('/', function (req, res) {
    getCollectionAsJSON(ROUTE).then(result => res.json(result));
});

router.get('/:eid' ,function (req, res) {
    let eventID = req.params.eid;

    getDokumentAsJSON(ROUTE, eventID).then(result => res.json(result));
});

//PUT-------------------------------------------------------------------
router.put('/:eid' ,function (req, res) {
    let eventID = req.params.eid;
    let newEvent = req.body;

    getDokumentAsJSON(ROUTE, eventID).then(result =>{

            DB.collection(ROUTE).doc(eventID).set(newEvent);
            res.send('Event: ' +eventID+'\n\nwas set from: ' + JSON.stringify(result) +'\nto: ' + JSON.stringify(newEvent));
        }
    );
});

//DELETE----------------------------------------------------------------
router.delete('/:eid' ,function (req, res) {
    let eventID = req.params.eid;
    DB.collection(ROUTE).doc(eventID).delete();
    res.send(eventID+' was deleted');
});

/************************************************************************
 * Wishes
 ************************************************************************/

//GET-------------------------------------------------------------------

// gebe alle Wuensche eines Events aus
router.get('/:eid/wishes', function (req, res) {
    getCollectionAsJSON(ROUTE + '/' + req.params.eid + '/' + ROUTE_WISH).then(result => res.json(result));

});

// gebe einen Wunschn für ein Event áus
router.get('/:eid/wishes/:wid', function (req, res) {
    let eventID = req.params.eid;
    let wishID = req.params.wid;
    getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_WISH, wishID).then(result => res.json(result));
});

//POST------------------------------------------------------------------

router.post('/:eid/wishes', function (req, res) {

    let wish = req.body; //JSON in Body
    let userID = wish.user;
    let eventID = req.params.eid;
    let route = ROUTE + "/" + eventID + "/" + ROUTE_WISH;

    let wishID = getIdInCollection(route);

    //POST it in Firebase
    DB.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).doc(wishID).set(wish);

    //Send the URI of new event
    let uri = "http://localhost:3000/" + route + "/" + wishID;
    res.set('location',uri);
    res.json(wish);
});

//PUT------------------------------------------------------------------
router.put('/:eid/wishes/:wid' ,function (req, res) {
    let eventID = req.params.eid;
    let wishID = req.params.wid;
    let newWish = req.body;
    let userID = newWish.user;
    let route = ROUTE + "/" + eventID + "/" + ROUTE_WISH;

    getDokumentAsJSON(route, wishID).then(result =>{

            DB.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).doc(wishID).set(newWish);
            res.send('Wish: ' +wishID+'\nwas set from: \n' + JSON.stringify(result) +'\nto: \n' + JSON.stringify(newWish));
        }
    );
});

//DELETE----------------------------------------------------------------
router.delete('/:eid/wishes/:wid' ,function (req, res) {
    let eventID = req.params.eid;
    let wishID = req.params.wid;
    DB.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).doc(wishID).delete();
    res.send(wishID+' was deleted');
});

/************************************************************************
 * Users
 ************************************************************************/
//GET-------------------------------------------------------------------

//all users of Event
router.get('/:eid/users', function (req, res) {
    getCollectionAsJSON(ROUTE + '/' + req.params.eid + '/' + ROUTE_USER).then(result => res.json(result));
});

//One User
router.get('/:eid/users/:uid', function (req, res) {
    let eventID = req.params.eid;
    let userID = req.params.uid;
    getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_USER, userID).then(result => res.json(result));
});

//POST------------------------------------------------------------------

router.post('/:eid/users', function (req, res) {

    let user = req.body; //JSON in Body
    let userID = user.user;
    let eventID = req.params.eid;
    let route = ROUTE + "/" + eventID + "/" + ROUTE_USER;

    //POST it in Firebase
    DB.collection(ROUTE).doc(eventID).collection(ROUTE_USER).doc(userID).set(user);

    //Send the URI of new event
    let uri = "http://localhost:3000/" + route + "/" + userID;
    res.set('location',uri);
    res.json(user);
});

//PUT------------------------------------------------------------------
router.put('/:eid/users/:uid' ,function (req, res) {
    let eventID = req.params.eid;
    let userID = req.params.uid;
    let newUser = req.body;

    let route = ROUTE + "/" + eventID + "/" + ROUTE_USER;

    getDokumentAsJSON(route, userID).then(result =>{

            DB.collection(ROUTE).doc(eventID).collection(ROUTE_USER).doc(userID).set(newUser);
            res.send('User: ' +userID+'\n in Event '+ eventID + ' was set from: \n' + JSON.stringify(result) +'\nto: \n' + JSON.stringify(newUser));
        }
    );
});

//DELETE----------------------------------------------------------------
router.delete('/:eid/users/:uid' ,function (req, res) {
    let eventID = req.params.eid;
    let userID = req.params.uid;
    DB.collection(ROUTE).doc(eventID).collection(ROUTE_USER).doc(userID).delete();
    res.send(userID+' was removed from Event: ' + eventID);
});


/************************************************************************
 * Soppinglist
 ************************************************************************/

//GET-------------------------------------------------------------------
router.get('/:eid/shoppinglist', function (req, res) {
    getCollectionAsJSON(ROUTE + '/' + req.params.eid + '/' + ROUTE_SHOP).then(result => res.json(result));
});

router.get('/:eid/shoppinglist/:sid', function (req, res) {
    let eventID = req.params.eid;
    let itemID = req.params.sid;
    getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_SHOP, itemID).then(result => res.json(result));
});

//POST-------------------------------------------------------------------
router.post('/:eid/shoppinglist', function (req, res) {
    let eventID = req.params.eid;
    //GET all WISHES in EVENT
    wishCollection = DB.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).orderBy('location', 'desc');

    //GET all USERS in EVENT
    userCollection = DB.collection(ROUTE).doc(eventID).collection(ROUTE_USER);

    userCollection.get()
        .then(users => {

            //GET all user Ids in Event
            userIDs = {};
            let userIndex = 0;
            users.forEach(user => {
                userIDs[userIndex] = user.id;
                userIndex++;
            });

            wishCollection.get()
                .then(wishes => {
                    let previosLocation = "";
                    let currentLocation = "";

                    let index = 0;

                    //Match Wishes by Location
                    wishes.forEach(wish => {
                        currentLocation = wish.data().location;
                        if(currentLocation != previosLocation){ // if more locations than users, loop back around
                            if(index == userIDs.size) {
                                index = 0
                            }else{
                                index++;
                            }
                        }
                        //add result to firestore
                        DB.collection(ROUTE).doc(eventID).collection(ROUTE_SHOP).doc(wish.id).set({"wish" : wish.id,"user" : userIDs[index]});
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

function getCollectionAsJSON(collectionName) {
    return new Promise(function (resolve) {
        let json = {};

        let collection = DB.collection(collectionName);
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
    let ref = DB.collection(collectionName).doc();
    let id = ref.id;

    return id;
}
function getDokumentAsJSON(collectionName,docName) {
    return new Promise(function (resolve) {
        let json = {};

        let document = DB.collection(collectionName).doc(docName);
        document.get()
            .then(doc => {
                json = doc.data();

            }).then(function () {
            resolve(json);
        });
    });
}
