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
 * @returns {Promise<JSON>} Promise that resolves as JSON
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
 * @returns {Promise<JSON>} Promise that resolves as JSON
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
 * @returns {Promise<boolean>} Promise that resolves as bool
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

/************************************************************************
 * Deprecated
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
