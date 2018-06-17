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
const ROUTE_WISH = "wishes";

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

//one new Wish
router.post('/:eid/wishes', function (req, res) {

    var wish = req.body; //JSON in Body
    var eventID = req.params.eid;
    var route = ROUTE + "/" + eventID + "/" + ROUTE_WISH;

    var wishID = getIdInCollection(route);

    //POST it in Firebase
    DB.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).doc(wishID).set(wish);

    //Send the URI of new event
    var uri = "http://localhost:3000/" + route + "/" + wishID;
    res.set('location',uri);
    res.json(event);
});

//PUT------------------------------------------------------------------
router.put('/:eid/wishes/:wid' ,function (req, res) {
    var eventID = req.params.eid;
    var wishID = req.params.wid;
    var newWish = req.body;
    var route = ROUTE + "/" + eventID + "/" + ROUTE_WISH;

    getDokumentAsJSON(route, wishID).then(result =>{

            DB.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).doc(wishID).set(newWish)
            res.send('Wish: ' +wishID+'\n\nwas set from: ' + JSON.stringify(result) +'\nto: ' + JSON.stringify(newWish));
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
 * Soppinglist
 ************************************************************************/

//GET-------------------------------------------------------------------

// gebe alle Shoppinglists eines Events aus
router.get('/:eid/shoppinglists', function (req, res) {
    getCollectionAsJSON(ROUTE + '/' + req.params.eid + '/' + ROUTE_SHOP).then(result => res.json(result));
});

// gebe die Shoppingliste für ein Event von einem User aus

router.get('/:eid/shoppinglists/:sid', function (req, res) {
    var eventID = req.params.eid;
    var userID = req.params.sid;
    getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_SHOP, userID).then(result => res.json(result));
});

//POST-------------------------------------------------------------------
router.post('/:eid/shoppinglists', function (req, res) {
    var eventID = req.params.eid;
    //GET all WISHES in EVENT

    //GET all USERS in EVENT

    //Match Wishes by Location

    //POST Shoppinglists for each USER
    DB.collection(ROUTE).doc(eventID).collection(ROUTE_SHOP).doc(userId).set(list);


    getDokumentAsJSON(ROUTE + '/' + eventID + '/' + ROUTE_SHOP, userID).then(result => res.json(result));
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

/*


    //GET All users of The Event and Crate wishlists for them
    eventUsers.forEach( userId => {
        var list = {};
        DB.collection(ROUTE).doc(eventID).collection(ROUTE_WISH).doc(userId).set(list);
    });
 */