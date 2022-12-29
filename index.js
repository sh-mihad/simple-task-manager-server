const express = require('express');
const app = express()
const port = process.env.PORT || 5000
const cors = require('cors');
app.use(cors())
app.use(express.json()); 
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const uri = `mongodb+srv://${process.env.M_DB_USER_NAME}:${process.env.M_DB_PASSWORD}@cluster0.pkgzac3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


app.get("/", (req,res)=>{
    res.send("Task Server is Running")
})

async function run(){
   try{
    const TaskCollection = client.db("Task-Manegment").collection("tasks")
    
    // Task Added to Data Base
    app.post("/tasks", async(req,res)=>{
     const task = req.body
     const date = Date()
     const status = "incomplete"
      const result = await TaskCollection.insertOne({...task,date:date,status})
      res.send(result)
     
    })

    // Get Tasks
    app.get("/tasks", async(req,res)=>{
        const query = {status:"incomplete"}
        const result =await TaskCollection.find(query).toArray()
        res.send(result);       
    })
    // Get Complete Tasks
    app.get("/complete-tasks", async(req,res)=>{
        const query = {status:"complete"}
        const result =await TaskCollection.find(query).toArray()
        res.send(result);       
    })

    // complete task status change
    app.put("/task-complete/:id", async(req,res)=>{
        const id = req.params.id
        const TaskStatus = req.body.status
        // console.log(id,TaskStatus)
        const filter = {_id:ObjectId(id)}
        const updateDoc ={
            $set: {
                status : TaskStatus
            }
        }
        const result = await TaskCollection.updateOne(filter,updateDoc)
        res.send(result)
    })

    //get a spacific data
    app.get("/task/:id", async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectId(id)}
        const result = await TaskCollection.findOne(query)
        res.send(result)
    })

    // Update a sefacific Task
    app.put("/task/:id", async(req,res)=>{
        const id = req.params.id;
        const UpdateDes= req.body.descripton
        const filter = {_id:ObjectId(id)}
        const updateDoc = {
            $set:{
                des : UpdateDes 
            }
        }
        const result = await TaskCollection.updateOne(filter,updateDoc)
        res.send(result)
    })

    // Delete Task api
    app.delete("/task-delete", async(req,res)=>{
       const query = {}
       const result = await TaskCollection.deleteOne(query)
       res.send(result) 
    })

    // Edit Task
    app.put("/tasks", async (req,res)=>{
        const task = req.body

    })

   }finally{

   }
}

run().catch(console.dir)




app.listen(port,()=>{
    console.log(`server is running at ${port}`);
})