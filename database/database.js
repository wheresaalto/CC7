const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;

var collections = {
    breed: null,
    facts: null

};

var client = null;
var database = null;

async function setup() {
    // ENTER YOUR MONGODB CONNECTION LINK IN THE LINE BELOW
    client = await new mongodb.MongoClient(' ... ').connect();

    // Setup your database here as we did in the Week 9 Class Code
}

// Remember to export the necessary variables