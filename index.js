const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect mongo server
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wuz72.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

const run = async () => {
    try {
        await client.connect();
        const recipeCollection = client
            .db('recipeCollection')
            .collection('recipe');

        // Get all recipes
        app.get('/recipes', async (req, res) => {
            const query = {};
            const cursor = recipeCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        // Get recipe by id
        app.get('/recipe/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const recipe = await recipeCollection.findOne(query);
            res.send(recipe);
        });

        // Add a recipe
        app.post('/recipes', async (req, res) => {
            const recipe = req.body;
            const result = await recipeCollection.insertOne(recipe);
            console.log(
                `A document was inserted with the _id: ${result.insertedId}`
            );
        });

        // delete a recipe
        app.delete('/recipe/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const recipe = await recipeCollection.deleteOne(query);

            if (recipe.deletedCount === 1) {
                console.log('Successfully deleted one document.');
            } else {
                console.log('No Item deleted');
            }
        });

        // update a recipe
        app.put('/recipe/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    name: updateUser.name,
                    image: updateUser.image,
                    instruction: updateUser.instruction,
                },
            };

            const result = await recipeCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.send(result);
            console.log(`Recipe Updated`);
        });
    } finally {
        // await client.close();
    }
};

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Red Onion Server');
});

// Listen to the port
app.listen(port, () => {
    console.log(`Red Onion Server is running at http://localhost:${port}/`);
});
