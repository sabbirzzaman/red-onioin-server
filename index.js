const express = require('express');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect mongo server
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get('/recipes', async (req, res) => {
            const query = {};
            const cursor = recipeCollection.find(query);

            const result = await cursor.toArray();
            res.send(result);
        });

        app.post('/recipes', async (req, res) => {
            const recipe = req.body;
            const result = await recipeCollection.insertOne(recipe);

            console.log(
                `A document was inserted with the _id: ${result.insertedId}`
            );
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
