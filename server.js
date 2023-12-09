// ----- CODE MODIFICATION NOT REQUIRED UNTIL LINE 40 OF THIS FILE -----

// Required modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const database = require('./database/database.js');
const { ObjectId } = require('mongodb');

const PORT = 3001;

const app = express();
app.use(bodyParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Function to get a random ID from the breeds collection
function breedRandomizer(breeds) {
    let breedsIDs = [];
    for (const i in breeds) {
        breedsIDs.push(breeds[i]._id.toString());
    }
    // Generate a random index within the bounds of the breedsIDs array's length
    console.log('Generated Breed IDs:', breedsIDs);
    const randomIndex = Math.floor(Math.random() * breedsIDs.length);
    // console.log(breedsIDs[randomIndex]);
    return(breedsIDs[randomIndex]);
}

// Function to get a random ID from the facts collection
function factRandomizer(facts) {
    let factsIDs = [];
    for (const i in facts) {
        factsIDs.push(facts[i]._id.toString());
    }
    // Generate a random index within the bounds of the factsIDs array's length
    const randomIndex = Math.floor(Math.random() * factsIDs.length);
    // console.log(factsIDs[randomIndex]);
    return(factsIDs[randomIndex]);
}

// Route for the homepage
app.get('/', async (req, res) => {
    // ----- Random Breed -----
    // Find all the breeds from the database and assign it to the breeds variable.
    const allBreeds = await database.collections.breed.find({}).toArray();
    console.log(allBreeds);
    // Call the breedRandomizer function to get a random breed ID.
    const randomBreedId = breedRandomizer(allBreeds);
    //console.log(randomBreedId);
    // Convert the randomBreedId to ObjectId
    const objectIdBreedId = new ObjectId(randomBreedId);

    // Use the random breed ID to get a random breed object from MongoDB
    const randomBreed = await database.collections.breed.findOne({ _id: objectIdBreedId });

    
    // Console log the random object you have fetched before rendering it on the home page
    console.log('Random Breed:', randomBreed);

    // ----- Random Fact -----
    // Find all the facts from the database and assign it to the facts variable.
    const allFacts = await database.collections.facts.find({}).toArray();

    // Call the factRandomizer function to get a random fact ID.
    const randomFactId = factRandomizer(allFacts);

    // Convert the randomFactID to Object Id
    const objectIdFactId = new ObjectId(randomFactId);

    // Use the random fact ID to get a random fact object from MongoDB
    const randomFact = await database.collections.facts.findOne({ _id: objectIdFactId });

    // Console log the random object you have fetched before rendering it on the home page
    console.log('Random Fact:', randomFact);

    // Render the homepage and pass the random breed and fact objects
    res.render('homepage', { randomBreed, randomFact });
    //res.render('homepage');
});

// Route to display all the breeds
app.get('/breeds', async (req, res) => {
    // Find all the breeds from the database
    const allBreeds = await database.collections.breed.find({}).toArray();

    // Render the breeds file in the cats folder under views and pass the breeds found to the template
    res.render('cats/breeds', { breeds: allBreeds });
});

// Route to display all the facts
app.get('/facts', async (req, res) => {
    // Find all the facts from the database
    const allFacts = await database.collections.facts.find({}).toArray();
    // Render the facts file in the cats folder under views and pass the facts found to the template
    res.render('cats/facts', { facts: allFacts});
});

// Route to display breed by ID
app.get('/breed/:breedId', async (req, res) => {
    
    // Get the breedId parameter from the URL
    const breedId = req.params.breedId;

    // Convert the ID from the URL into the proper ObjectId format expected by MongoDB
    const breedObjectId = new database.ObjectId(breedId);

    // Find the breed object from MongoDB using the provided ID
    const breed = await database.collections.breed.findOne({ _id: breedObjectId });

    // Render the breed file in the cats folder under views and pass the breed found using the provided to the template
    res.render('cats/breed', { breed });
});

// Route to display fact by ID
app.get('/facts/:factId', async (req, res) => {
    // Get the factId parameter from the URL
    const factId = req.params.factId;

    // Convert the ID from the URL into the proper ObjectId format expected by MongoDB
    const ObjectId = require('mongodb').ObjectId;
    const factObjectId = new ObjectId(factId);

    // Find the fact object from MongoDB using the provided ID
    const fact = await database.collections.facts.findOne({ _id: factObjectId });

    // Render the fact file in the cats folder under views and pass the fact found to the template
    res.render('cats/fact', { fact });
});

app.listen(PORT, async () => {
    await database.setup();
    console.log(`Server started on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, 'public')));

process.on('SIGTERM', () => {
    app.close(() => {
        database.client.close();
    });
});