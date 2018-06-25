/************************************************************************
 * Init-Modules
 ************************************************************************/

//init firestore module
const ADMIN = require("firebase-admin");
const DB = ADMIN.firestore();

//init express module
// cn: besser nur const oder let verwenden
var express = require("express");
var router = express.Router(null);

const ROUTE = "events";
const ROUTE_WISH = "wishes";
const ROUTE_SHOP = "shoppinglist"
const ROUTE_USER = "users"

/************************************************************************
 * Events
 ************************************************************************/

//POST-------------------------------------------------------------------
router.post('/', function (req, res) {

    var event = req.body; //JSON in Body

    var eventID = getIdInCollection(ROUTE);

    //POST it in Firebase
    DB.collection(ROUTE).doc(eventID).set(event);

    //Send the URI of new event
    var uri = "http://localhost:3000/" + ROUTE + "/" + eventID;
    res.set('location',uri);
    res.json(event);
});

//GET-------------------------------------------------------------------
router.get('/', function (req, res) {
    getCollectionAsJSON(ROUTE).then(result => res.json(result));
});

router.get('/:eid' ,function (req, res) {
    var eventID = req.params.eid;

    getDokumentAsJSON(ROUTE, eventID).then(result => res.json(result));
});

//PUT-------------------------------------------------------------------
router.put('/:eid' ,function (req, res) {
    var eventID = req.params.eid;
    var newEvent = req.body;

    getDokumentAsJSON(ROUTE, eventID).then(result =>{

            DB.collection(ROUTE).doc(eventID).set(newEvent);
            res.send('Event: ' +eventID+'\n\nwas set from: ' + JSON.stringify(result) +'\nto: ' + JSON.stringify(newEvent));
        }
    );
});

//DELETE----------------------------------------------------------------
router.delete('/:eid' ,function (req, res) {
    var eventID = req.params.eid;
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
    var eventID = req.params.eid;
    var wishID = req.params.wid;
    getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_WISH, wishID).then(result => res.json(result));
});

//POST------------------------------------------------------------------

router.post('/:eid/wishes', function (req, res) {

    var wish = req.body; //JSON in Body
    var userID = wish.user;
    var eventID = req.params.eid;
    var route = ROUTE + "/" + eventID + "/" + ROUTE_WISH;

    var wishID = getIdInCollection(route);

    //POST it in Firebase
    DB.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).doc(wishID).set(wish);

    //Send the URI of new event
    var uri = "http://localhost:3000/" + route + "/" + wishID;
    res.set('location',uri);
    res.json(wish);
});

//PUT------------------------------------------------------------------
router.put('/:eid/wishes/:wid' ,function (req, res) {
    var eventID = req.params.eid;
    var wishID = req.params.wid;
    var newWish = req.body;
    var userID = newWish.user;
    var route = ROUTE + "/" + eventID + "/" + ROUTE_WISH;

    getDokumentAsJSON(route, wishID).then(result =>{

            DB.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).doc(wishID).set(newWish);
            res.send('Wish: ' +wishID+'\nwas set from: \n' + JSON.stringify(result) +'\nto: \n' + JSON.stringify(newWish));
        }
    );
});

//DELETE----------------------------------------------------------------
router.delete('/:eid/wishes/:wid' ,function (req, res) {
    var eventID = req.params.eid;
    var wishID = req.params.wid;
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
    var eventID = req.params.eid;
    var userID = req.params.uid;
    getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_USER, userID).then(result => res.json(result));
});

//POST------------------------------------------------------------------

router.post('/:eid/users', function (req, res) {

    var user = req.body; //JSON in Body
    var userID = user.user;
    var eventID = req.params.eid;
    var route = ROUTE + "/" + eventID + "/" + ROUTE_USER;

    //POST it in Firebase
    DB.collection(ROUTE).doc(eventID).collection(ROUTE_USER).doc(userID).set(user);

    //Send the URI of new event
    var uri = "http://localhost:3000/" + route + "/" + userID;
    res.set('location',uri);
    res.json(user);
});

//PUT------------------------------------------------------------------
router.put('/:eid/users/:uid' ,function (req, res) {
    var eventID = req.params.eid;
    var userID = req.params.uid;
    var newUser = req.body;

    var route = ROUTE + "/" + eventID + "/" + ROUTE_USER;

    getDokumentAsJSON(route, userID).then(result =>{

            DB.collection(ROUTE).doc(eventID).collection(ROUTE_USER).doc(userID).set(newUser);
            res.send('User: ' +userID+'\n in Event '+ eventID + ' was set from: \n' + JSON.stringify(result) +'\nto: \n' + JSON.stringify(newUser));
        }
    );
});

//DELETE----------------------------------------------------------------
router.delete('/:eid/users/:uid' ,function (req, res) {
    var eventID = req.params.eid;
    var userID = req.params.uid;
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
    var eventID = req.params.eid;
    var itemID = req.params.sid;
    getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_SHOP, itemID).then(result => res.json(result));
});

//POST-------------------------------------------------------------------
router.post('/:eid/shoppinglist', function (req, res) {
    var eventID = req.params.eid;
    //GET all WISHES in EVENT
    wishCollection = DB.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).orderBy('location', 'desc');

    //GET all USERS in EVENT
    userCollection = DB.collection(ROUTE).doc(eventID).collection(ROUTE_USER);

    userCollection.get()
        .then(users => {

            //GET all user Ids in Event
            userIDs = {};
            var userIndex = 0;
            users.forEach(user => {
                userIDs[userIndex] = user.id;
                userIndex++;
            });

            wishCollection.get()
                .then(wishes => {
                    var previosLocation = "";
                    var currentLocation = "";

                    var index = 0;

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
