const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');

// port
const port = process.env.PORT || 5000;

// middleware
const cors = require('cors')
app.use(cors())
app.use(express.json())
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.33slg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

app.get('/', (req, res)=>{
    res.send("Server is running")
})

async function run(){
    try{
        await client.connect()
        const database = client.db('tourServices')
        const serviceCollection = database.collection('service')
        const orderCollection = database.collection('orderList')

        app.post("/addUser", async (req, res) => {
            console.log("hitting the post");
            const result = await serviceCollection.insertOne(req.body);
            res.json(result);
          });
        app.get('/services', async(req, res)=>{
            console.log("hitting the post");
            const cursor = serviceCollection.find({})
            const result = await cursor.toArray()
            res.send(result)
        })
        app.post('/placeOrder', async(req,res)=>{
            console.log('hitting the second data base');

            const result = await orderCollection.insertOne(req.body)
            res.json(result)
            console.log(result);
        })
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir)



//listening port
app.listen(port, ()=>{
    console.log("Server is running on", port);
})