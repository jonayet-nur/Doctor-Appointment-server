const express = require('express')
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();
const uri = process.env.MONGODB_URI
const cors = require('cors');
const app = express()
const port = process.env.PORT

app.use(cors());
app.use(express.json());

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
    await client.connect();
    const db = client.db('doctor-manager')
    const doctorCollection = db.collection('all-appiontment')
    const bookingCollection = db.collection('bookings')

     app.get('/all-appointment',async(req,res)=>{
      const cursor = doctorCollection.find()
      const result = await cursor.toArray()
      res.json(result)
    })

    app.get("/top-doctors", async (req, res) => {
  const doctorsCollection = db.collection("all-appiontment");

  const result = await doctorsCollection
    .find()
    .sort({ rating: -1 }) // highest rating first
    .limit(3) // only 3 doctors
    .toArray();

  res.send(result);
});

app.get('/all-appointment/:id',async(req,res)=>{
  const {id} = req.params
  const result = await doctorCollection.findOne({_id: new ObjectId(id)})
  res.json(result)
})

app.post('/bookings',async(req,res)=>{
  const booking = req.body
   console.log("data to be inserted  booking", booking);
   const result = await bookingCollection.insertOne(booking)
   res.json(result)
})

  // get api for all appointments data for my-booking page
    app.get("/bookings", async (req, res) => {
      const appointments = bookingCollection.find({});
      const result = await appointments.toArray();
      res.send(result);
    });

    app.delete('/bookings/:id',async(req,res)=>{
      const {id} = req.params
      const result = await bookingCollection.deleteOne({_id: new ObjectId(id)})
       res.json(result)
    })

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

 
app.get('/',(req,res)=>{
    res.send("hello get port running 5000")
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})