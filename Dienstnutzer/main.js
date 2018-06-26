/* WBA2 Gruppe Sebastian Faust, Arthur Tissen, Julian Schoemaker */

/************************************************************************
 * Load modules
 ************************************************************************/

const rp = require('request-promise');
const chalk = require('chalk');
const readlineSync = require('readline-sync');

const DIENST_GEBER = 'http://localhost:3000';
selectOptions = ['Create New Event','Add Wish'];

/************************************************************************
 * Main
 ************************************************************************/

console.log(
    chalk.magenta('-------------------------\n') +
    '- Welcome to the Worlds -\n' +
    '- Greatest Partyplaner  -\n' +
    chalk.magenta('-------------------------'));


    let select = readlineSync.keyInSelect(selectOptions, 'What do you Want to do? ');
    switch (select){
        case 0:
            createNewEvent();
            break;
        case 1:
            addWish();
            break;

    }


/************************************************************************
 * Functions
 ************************************************************************/

function createNewEvent() {
    let usersNames = [];
    let eventName;

    //Dialog------------------------------------------
    eventName = readlineSync.question('What is the Name of your new Event?\n');
    console.log("Enter the Names of the People you want to add to the Event (Press ENTER again to Confirm)");

    while (run = true) {
        let newName =  readlineSync.question('name: ');

        if(newName == ""){
            break;
        }else {
            usersNames.push(newName);
        }
    }

    //Logic-------------------------------------------
    postUsers(usersNames).then(function (users) {  //Create new Useres for each name
        postEvent(eventName).then(function (eventlocation) {  //Create Event with given name
            postUsersToEvent(users,eventlocation);                  //Add Users to Event

            //Build Response Text
            let responseMessage =
                "----------------------------------------------------\n" +
                "The Event: " + chalk.green(eventName) + " was created\n"+
                "Event URI: " + chalk.blue(eventlocation) +"\n"+
                "----------------------------------------------------\n" +
                "The Users : " + chalk.magenta(JSON.stringify(users)) + "\n\nhave been created and where added to the Event.";
            console.log(responseMessage);
        });
    });


}
function addWish() {

    //Dialog------------------------------------------
    console.log("As which "+chalk.red("user")+" do you want to act?\n");

    getAllUsers().then(function (users) {
        console.log(chalk.red("--------------------------------------"));
        console.log(users);
        console.log(chalk.red("--------------------------------------"));
        let userID = readlineSync.question('What is it\'s user ID? ');
    });

}
function getEventsOfUser(user) {
    return new Promise(function (resolve) {
        let options = {
            uri: DIENST_GEBER + '/events',
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };

        rp(options)
            .then(function (res) {
                resolve(res);
            });
    });
}
function getAllUsers() {
    return new Promise(function (resolve) {
        let options = {
            uri: DIENST_GEBER + '/users',
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };

        rp(options)
            .then(function (res) {
                resolve(res);
            });
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
    return new Promise((resolve, reject) => {  //Build Promise

        for (let key in userIDs){ //Iterate through all User names in req

            let userName = key;
            let userID = userIDs[key];

            options.body = {'user': uriToID(userID)}; //Get Id of each User
            rp(options); //Send
        }
        resolve();
    });
}