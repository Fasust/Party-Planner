/* WBA2 Gruppe Sebastian Faust, Arthur Tissen, Julian Schoemaker */

/************************************************************************
 * Load modules
 ************************************************************************/

const request = require('request');
const rp = require('request-promise');

//Express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

const PORT = 4000;
const DIENST_GEBER = 'http://localhost:3000';

/************************************************************************
 * Main
 ************************************************************************/

initExpress();

app.post('/events', function (req, res) {

    //GET Data from reg------------------------------------
    let usersNames = req.body.users; //Get list of user Names
    let eventName = req.body.name; //Get Event Name


    postUsers(usersNames).then(function (users) {
        postEvent(eventName).then(function (eventlocation) {
            postUsersToEvent(users,eventlocation);

            let responseMessage = "Das Event: " + eventName + " wurde erstellt\n"
                +"Sie finden es hier: " + eventlocation
            + "\n\nDie User : " + JSON.stringify(users) + "\nwurder erstellt und dem Event zugefügt.";

            res.send(responseMessage); //send Response
        });
    });

});



/************************************************************************
 * Functions
 ************************************************************************/
/**
 * Initalize Express: Listen on Port, Init Log, init Erro Handling
 */
function initExpress() {

    app.listen(PORT, function () {
        console.log('--Listening on port 4000--');
    });

    //Error Handler
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    //Log
    app.use(function(req, res, next) {
        console.log("Time: \t" + Date.now() + "\t| Request-path:\t" + req.path);
        next();
    });
}
/**
 * Cuts a URI (URL) at its last "/" and returns the second half of the string
 * @param uri a URI as a String
 * @returns {*|string} hopefully an ID
 */
function uriToID(uri) {
    let uriArray = uri.split('/');
    return uriArray[uriArray.length -1];
}

/**
 * Takes an Array of Names and Posts each on as a new User
 * @param userNames Array of names
 * @returns {Promise<any>} a Promis that is to be resoled with a JSON that links each name to there Location (URI) in the System
 */
function postUsers(userNames) {
    let users = {};

    //Build base Options
    let options = {
        method: 'POST',
        uri : DIENST_GEBER + '/users',
        json: true, // Automatically stringifies the body to JSON
        resolveWithFullResponse: true
    };

    return new Promise((resolve, reject) => { //Build Promise
        let promiseCount = 0;

        userNames.forEach(function (userName) { //Iterate through all User names in req
            options.body = {'name': userName};

            rp(options).then(function (rpResponse) { //Post to "Dienstgeber" for each username
                //Save Location of each User
                users[userName] = rpResponse.headers.location;
            }).then(function () { //check if all users have been POSTed
                if(promiseCount < userNames.length -1){
                    promiseCount++;
                } else {
                    resolve(users);
                }
            });
        });
    });
}
/**
 * POST new Event with Given Name
 * @param eventName name of event to be Posted
 * @returns {Promise<any>} A promise that is to be resolved with a String that contains the Location (URI) of the new Event
 */
function postEvent(eventName) {
    let eventLocation;

    //Build base Options
    let options = {
        method: 'POST',
        uri :  DIENST_GEBER + '/events',
        body : {'name' : eventName},
        json: true, // Automatically stringifies the body to JSON
        resolveWithFullResponse: true
    };

    return new Promise((resolve, reject) => {  //Build Promise
        rp(options).then(function (rpResponse) {
            //Save Event location
            eventLocation = rpResponse.headers.location;
            console.log("Event Location in Event Promise: " + eventLocation);
            resolve(eventLocation);
        });
    });
}
/**
 * Adds multiple users to given Event
 * @param userIDs JSON of User names that map to their IDs (Return of "postUsers")
 * @param eventlocation URI of Event
 * @returns {Promise<any>}
 */
function postUsersToEvent(userIDs, eventlocation) {

    let options = {
        method: 'POST',
        uri :  eventlocation + '/users',
        json: true, // Automatically stringifies the body to JSON
        resolveWithFullResponse: true
    };
    console.log("Eventlocation in User to Event " +options.uri);

    return new Promise((resolve, reject) => {  //Build Promise

        for (let key in userIDs){ //Iterate through all User names in req

            let userName = key;
            let userID = userIDs[key];
            console.log(key +" | " + userID);

            options.body = {'user': uriToID(userID)}; //Get Id of each User
            rp(options); //Send
        }
        resolve();
    });
}