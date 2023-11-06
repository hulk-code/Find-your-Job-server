const express = require('express')
const cors=require('cors')
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT || 5000
app.use(express.json())
app.use(cors())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bw2yndc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const database = client.db("FindYourJob");
    const jobCollection = database.collection("catagoryjob");
    const bookedJob=database.collection("bookedjob");


    // to find all the data
    app.get('/jobs' ,async(req ,res) =>{
        let query={}
        const category=req.query.category
        if(category){
            query.category=category
        }
        const cursor =jobCollection.find(query);
        const result=await cursor.toArray()
        res.send(result)

    })

  //  send add data
    app.post('/jobs' ,async(req ,res) =>{
      const addJobs=req.body;
      console.log(addJobs)
      const result=await jobCollection.insertOne(addJobs)
      res.send(result)
    })

    app.delete('/jobs/:id' ,async(req ,res) =>{
      const id=req.params.id
      const query={
        _id:new ObjectId(id)
      }
      const result=await jobCollection.deleteOne(query)
      res.send(result)
    })


  //  get add data for specific email
  app.get('/job', async(req ,res)=>{
      
    let query={}
      
    if(req.query?.email){
        query={email:req.query.email}
    }
    const result=await jobCollection.find(query).toArray()
    res.send(result);
    
    
  })
 
      

      app.get('/jobs/:id' ,async(req ,res) =>{
        const id=req.params.id;
        const query={
            _id:new ObjectId(id)
        }
        const result=await jobCollection.findOne(query)
        res.send(result)
      })


      app.post('/bookings' , async(req ,res) =>{
        const booking=req.body;
        console.log(booking)
        const result=await bookedJob.insertOne(booking)
        res.send(result)
        
    })

    app.get('/bookings', async(req ,res)=>{
      
      let query={}
        
      if(req.query?.email){
          query={email:req.query.email}
      }
      const result=await bookedJob.find(query).toArray()
      res.send(result);
      
      
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})