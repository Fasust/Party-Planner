/* WBA2 Gruppe Sebastian Faust, Arthur Tissen, Julian Schoemaker */

/************************************************************************
 * Load modules
 ************************************************************************/

const rp = require('request-promise');
const chalk = require('chalk');
const readlineSync = require('readline-sync');

//const DIENST_GEBER = 'https://wba2-2018.herokuapp.com';
const DIENST_GEBER = 'http://localhost:3000';

/************************************************************************
 * Main
 ************************************************************************/

console.log(
    chalk.magenta('-------------------------\n') +
    '- Welcome to the Worlds -\n' +
    '- Greatest Partyplaner  -\n' +
    chalk.magenta('-------------------------'));

let selectOptions = ['Login','Register'];
let select = readlineSync.keyInSelect(selectOptions, 'What do you Want to do? ');

switch (select){
    case 0:
        login().then( id => logedIn(id));
        break;
    case 1:
        register().then( id => logedIn(id));
        break;
}


/************************************************************************
 * Functions
 ************************************************************************/
//Dialoges------------------------------------
function logedIn(userID) {
    console.log(chalk.magenta("--------------------------------------"));
    console.log("You are Now Loged in as "+chalk.red(userID));
    console.log(chalk.magenta("--------------------------------------"));

    let selectOptions = ['Create Event','Show your Events','Enter an Event','Add Wish','Finalize the Shopping List for an Event','Get Your Shopping List for an Event'];
    let select = readlineSync.keyInSelect(selectOptions, 'What do you Want to do? ');

    switch (select){
        case 0:
            createNewEvent().then(function (location) {
                let responseMessage =
                    chalk.blue("----------------------------------------------------\n") +
                    "The Event Was Created\n: "+
                    "You can find it here: "+ location + "\n"+
                    chalk.blue("----------------------------------------------------\n");
                console.log(responseMessage);

                //Recursion
                logedIn(userID);
            });
            break;
        case 1:
            getEventsOfUser(userID).then( function(events){
                console.log(chalk.blue("Your " + chalk.blue("Events:")));
                console.log(chalk.blue("-------------------"));
                console.log(events);
                console.log(chalk.blue("-------------------"));

                //Recursion
                logedIn(userID);
            });
            break;
        case 2:
            enterEvent(userID).then(res => logedIn(userID));
            break;
        case 3:
            creatNewWish(userID).then(res => logedIn(userID));
            break;
        case 4:
            //Post shoppinglist
            chooseOneEvent(userID).then(function (eventID) {

                generateShoppingslist(eventID);

                let responseMessage =
                    chalk.blue("----------------------------------------------------\n") +
                    "The Shoppingslists are created now\n " +
                    chalk.blue("----------------------------------------------------\n");
                console.log(responseMessage);

                //Recursion
                logedIn(userID);
            });
            break;
        case 5:
            //Get My Shoppinglist for event
            // gesamte Shoppinglist für ein Event durchlaufen
            chooseOneEvent(userID).then(function (eventID) {

                getMyShoppinglist(userID, eventID).then(function (myShoppingList) {
                    let listCounter = 0;

                    let responseMessage =
                        chalk.yellow("----------------------------------------------------\n") +
                        "Your shoppinglist: \n" +
                        chalk.yellow("----------------------------------------------------\n");
                    console.log(responseMessage);

                    // getWish Befehl der aus dem array alle Wünsche mit Location ausgibt
                    myShoppingList.forEach(function (wish) {
                        getWish(uriToID(wish), eventID).then(function (wishJson) {
                            console.log(wishJson);
                            listCounter++;

                            if(listCounter >= myShoppingList.length){
                                //Recursion
                                logedIn(userID);
                            }
                        });

                    });

                });




            });

            break;
    }
}
function login() {
    return new Promise(function (resolve) {
        //Dialog------------------------------------------
        console.log("These ar all "+chalk.red("users")+"\n");

        getAllUsers().then(function (users) {
            console.log(chalk.red("--------------------------------------"));
            console.log(users);
            console.log(chalk.red("--------------------------------------"));
            let userID = readlineSync.question('as which one do you want to act?\nUserId: ');

            resolve(userID);
        });
    });

}
function register() {
    return new Promise(function (resolve) {
        let names = [];
        let userName = readlineSync.question('What is your Name?\nName: ');
        names.push(userName);
        postUsers(names).then(function (json) {
            console.log(json);
            resolve(uriToID(json[userName]));
        });
    });
}
function createNewEvent() {
    return new Promise(function (resolve) {
        let eventName = readlineSync.question('What is the Name of your new Event?\n');
        postEvent(eventName).then(function (location) {

            resolve(location);
        });
    });

}
function enterEvent(userID) {
    return new Promise(function (resolve) {
        getAllEvents().then(function (events) {
            console.log("These are all " + chalk.blue("Events") + "\n");
            console.log(chalk.blue("--------------------------------------"));
            console.log(events);
            console.log(chalk.blue("--------------------------------------"));
            let eventID = readlineSync.question('which one do you want to join?\nEventId: ');
            let users = [];
            users.push(userID);
            postUsersToEvent(users, eventID).then(function () {
                console.log("User " + chalk.red(userID) + " has been Added to Event " + chalk.blue(eventID));
                resolve();
            });
        });
    });

}
function creatNewWish(userID) {
    return new Promise(function (resolve) {
        getEventsOfUser(userID).then(function (events) {
            console.log("These are all your "+chalk.blue("Events")+"\n");
            console.log(chalk.blue("--------------------------------------"));
            console.log(events);
            console.log(chalk.blue("--------------------------------------"));
            let eventID = readlineSync.question('where do you want to add new Wishes?\nEventId: ');

            console.log("Enter the Wishes you You Want to add to this Event (Press ENTER on empty input to Abort)");

            let caseSwitch = "nameCase";
            let name;
            let location;


            while (true) {
                switch (caseSwitch){
                    case "nameCase":
                        name =  readlineSync.question('name: ');
                        if(name == ""){
                            return;
                        }
                        caseSwitch = "locCase";
                        break;
                    case "locCase":
                        location =  readlineSync.question('location: ');
                        if(location == ""){
                            resolve();
                        }

                        postWish(eventID,userID,name,location);

                        caseSwitch = "nameCase";
                        break;
                }

            }
        });
    });
}
function chooseOneEvent(userID) {
    return new Promise(function (resolve) {
        getEventsOfUser(userID).then(function (events) {
            console.log("These are all your "+ chalk.blue("Events")+"\n");
            console.log(chalk.blue("--------------------------------------"));
            console.log(events);
            console.log(chalk.blue("--------------------------------------"));
            let eventID = readlineSync.question('Which event you want to select?\nEventId: ');

            resolve(eventID);
        });
    });
}

function createNewEventAndAddUsers() {
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
            postUsersToEvent(users,uriToID(eventlocation)).then(function () { //Add Users to Event

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
    });


}

//Helper Functions--------------------------------
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
 * @param userURIs JSON of User names that map to their URIs (Return of "postUsers")
 * @param eventlocation URI of Event
 * @returns {Promise<any>}
 */
function postUsersToEvent(userURIs, eventID) {

    let options = {
        method: 'POST',
        uri :  DIENST_GEBER + '/events/' + eventID + '/users',
        json: true, // Automatically stringifies the body to JSON
        resolveWithFullResponse: true
    };
    return new Promise((resolve, reject) => {  //Build Promise

        for (let key in userURIs){ //Iterate through all User names in req

            let userName = key;
            let userURI = userURIs[key];

            options.body = {'user': uriToID(userURI)}; //Get Id of each User


            rp(options);
            console.log(options.body);

        }
        resolve();
    });
}
function postWish(eventID,userID,name,location) {
    //Build base Options
    let options = {
        method: 'POST',
        uri :  DIENST_GEBER + '/events/' + eventID + '/wishes',
        body :
            {'name' : name,
                'location': location,
                'user': userID},
        json: true, // Automatically stringifies the body to JSON
        resolveWithFullResponse: true
    };
    rp(options);
}
function getEventsOfUser(userId) {
    return new Promise(function (resolve) {
        let options = {
            uri: DIENST_GEBER + '/users/' + userId + '/events',
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
function getAllEvents() {
    return new Promise(function (resolve) {
        let options = {
            uri: DIENST_GEBER + '/events' ,
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
function getWish(wishID, eventID) {
    return new Promise(function (resolve) {
        let options = {
            uri: DIENST_GEBER + '/events/' + eventID + '/wishes/' + wishID,
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
function generateShoppingslist(eventID) {
    let options = {
        method: 'POST',
        uri :  DIENST_GEBER + '/events/' + eventID + '/shoppinglist',
        json: true, // Automatically stringifies the body to JSON
        resolveWithFullResponse: true
    };
    rp(options);
}
function getMyShoppinglist(userID, eventID) {
    return new Promise(function (resolve) {
        let options = {
            method: 'GET',
            uri: DIENST_GEBER + '/events/' + eventID + '/shoppinglist',
            json: true, // Automatically stringifies the body to JSON
            resolveWithFullResponse: false
        };

        // alle shoppinglist einträge durchsuchen und die nehmen, wo user = userID ist


        rp(options).then(function (allShoppingItems) {

            let myShoppingList = [];

            let arrayCounter = 0;

            for(let key in allShoppingItems){
                let potentialUserId = uriToID(allShoppingItems[key].user);
                arrayCounter++;

                if(potentialUserId.localeCompare(userID)) {
                    myShoppingList.push(allShoppingItems[key].wish);
                }

                if(arrayCounter >= Object.keys(allShoppingItems).length) {
                    resolve(myShoppingList);
                }

            }

            }
        );
    });


}

