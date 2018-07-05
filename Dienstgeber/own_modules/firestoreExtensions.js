//firestore
const admin = require("firebase-admin");
const db = admin.firestore();


/************************************************************************
 * Functions
 ************************************************************************/

/**
 * Returns a unigue ID in a specific collection
 * @param collectionName name of the collection that a id is to be generated for
 * @returns int id unique ID
 */
exports.getIdInCollection = function(collectionName) {
    let ref = db.collection(collectionName).doc();
    let id = ref.id;

    return id;
}
/**
 * Returns a Promise that is to be resolved as a JSON and represents a specific collection (GET)
 * @param collectionName naem of the collecetion
 * @returns {Promise<any>} Promise that resolves as JSON
 */
exports.getCollectionAsJSON =  function(collectionName) {
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
};
/**
 * Returns a Promise that is to be resolved as a JSON and represents a specific document in a collection (GET)
 * @param collectionName name of the collection
 * @param docName name of the documeten
 * @returns {Promise<any>} Promise that resolves as JSON
 */
exports.getDokumentAsJSON = function(collectionName,docName) {
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
};
/**
 * Returns a Promise that is to be resolved as a boolean that shows us if a ID exists in a collection
 * @param collectionName name of the collection
 * @param docName name of the document
 * @returns {Promise<any>} Promise that resolves as bool
 */
exports.checkIfDocInCollection = function(collectionName, docName) {
    return new Promise(function (resolve) {
        // Test for the existence of certain keys within a DataSnapshot;
        db.collection(collectionName).doc(docName).get()
            .then(function(snapshot) {
                let idExists = snapshot.exists;
                resolve(idExists);
            });
    });
};