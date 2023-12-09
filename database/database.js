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
    client = await new mongodb.MongoClient('mongodb+srv://testUser:testPassword@testcluster.zyznncd.mongodb.net/?retryWrites=true&w=majority').connect();

    // Setup your database here as we did in the Week 9 Class Code
    database = client.db('catsdb'); // Replace 'your-database-name' with your actual database name
    collections.breed = database.collection('breeds');
    collections.facts = database.collection('facts');
}

// Remember to export the necessary variables
module.exports = {
    collections,
    setup,
    ObjectId
};
