const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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

        app.post("/addServices", async (req, res) => {
            console.log("hitting the post");
            const result = await serviceCollection.insertOne(req.body);
            res.json(result);
          });
        app.get('/services', async(req, res)=>{
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
        app.get('/myOrder', async(req, res)=>{
            const email = req.body.email;
            console.log(email);
            const cursor = orderCollection.find({})
            const result = await cursor.toArray()
            console.log("Order is working", result);
            res.send(result)
        })

        //For myOrder
        app.get('/myOrder/:email', async(req, res)=>{
            const query = {email: req.params.email};
            console.log("getting the myorder", query);
            const result = await orderCollection.find(query).toArray()
            res.send(result)
        })

        //For delete myOrder
        app.delete('/deletOrder/:id', async(req,res)=>{
            const id = (req.params.id);
            const query = {_id: ObjectId(id)}
            console.log(query);
            const result = await orderCollection.deleteOne({
                _id: ObjectId(req.params.id),
              });
              console.log(result);
              res.send(result);
        })
        //for remove order from manage order
        app.delete('/removeOrder/:id', async(req, res)=>{
            console.log(req.params.id);
            const result = await orderCollection.deleteOne({
                _id:ObjectId(req.params.id)
            })
 
            res.send(result)
        })

        //Fot update status
        app.put('/updateStatus/:id',async(req,res)=>{
            console.log(req.params.id);
            // console.log(req.body);
            const filter = { _id: ObjectId(req.params.id)}
            const updateDoc = {
                $set: {
                  status: "approved"
                },
              };
              const result = await orderCollection.updateOne(filter, updateDoc);
              console.log(result);
            res.send(result)
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