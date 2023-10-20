const express = require("express");
require("dotenv").config();
require("colors");
const cors = require("cors");
const app = express();
const { PORT, DB, PASS } = process.env;
const port = PORT;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// middleware
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${DB}:${PASS}@cluster0.telyg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

client
  .connect()
  .then((res) => {
    console.log("Connected to MongoDB".bold.inverse);
    console.log("Connected to MongoDB".bold.rainbow);
    console.log("Connected to MongoDB".bold.trap);
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

async function run() {
  try {
    //   before deploy to vercel
    const database = client.db("userDB");
    const userCollection = database.collection("users");

    //crud operations
    /************* all get api's here ************/

    app.get("/users", async (req, res) => {
      const dbLocation = await userCollection.find();
      const result = await dbLocation.toArray();
      res.send({
        message: "success",
        result: result,
      });
    });

    app.get("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      if (result) {
        res.send({ message: "success", result: result });
      } else {
        res.send({ message: "user not found" });
      }
    });

    //   for single user
    // app.get("/user/:userId", async (req, res) => {
    //   const id = req.params.userId;
    //   const convertedID = new ObjectId(id);
    //       const query = { _id: convertedID };
    //     // const query = { name : value from client }

    //   const result = await userCollection.findOne(query);
    //   res.send({
    //     message: "success",
    //     result: result,
    //   });
    // });

    /************* all POST api's here ************/

    app.post("/users", async (req, res) => {
      const inputData = req.body;
      const result = await userCollection.insertOne(inputData);
      res.send(result);
    });

    /************* all DELETE api's here ************/

    app.delete("/user/:userId", async (req, res) => {
      const id = req.params.userId;
      const query = { _id: new ObjectId(id) };
      // deletion
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    /************* all PUT api's here ************/

    app.put("/user/:userId", async (req, res) => {
      const id = req.params.userId;

      // kake update krbo
      const filter = { _id: new ObjectId(id) };

      const inputData = req.body;

      // ki update krbo
      const updateDoc = {
        $set: {
          name: inputData.name,
        },
      };

      // kivabe update krbo(optional)
      const options = { upsert: true };

      // updating
      //   await userCollection.updateOne(kake update , ki update, kivabe);
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("<h1>Hey! server is running!</h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
