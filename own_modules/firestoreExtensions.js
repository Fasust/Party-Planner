//firestore
const admin = require("firebase-admin");
const db = admin.firestore();


/************************************************************************
 * Functions
 ************************************************************************/

function getIdInCollection(collectionName) {
    var ref = db.collection(collectionName).doc();
    var id = ref.id;

    return id;
}
function getCollectionAsJSON(collectionName) {
    return new Promise(function (resolve) {
        var json = {};

        var collection = db.collection(collectionName);
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
        var json = {};

        var document = db.collection(collectionName).doc(docName);
        document.get()
            .then(doc => {
                json = doc.data();

            }).then(function () {
            resolve(json);
        });
    });
}

module.exports = {
    getIdInCollection,
    getCollectionAsJSON,
    getDokumentAsJSON
};