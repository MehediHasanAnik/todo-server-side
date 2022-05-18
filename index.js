const express = require('express')

const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.klyfg.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const todoCollecton = client.db('todo-app').collection('todo');

        // to get api
        app.get('/todo', async (req, res) => {
            const query = {};
            const cursor = todoCollecton.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/todo/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todoCollecton.findOne(query);
            res.send(result);
        })


        // to post api
        app.post('/todo', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await todoCollecton.insertOne(data);
            res.send(result)

        })
        // to delete api
        app.delete('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const result = await todoCollecton.deleteOne(filter);
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello anik!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})