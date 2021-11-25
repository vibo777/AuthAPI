const express = require('express');
const mongoose = require('mongoose');

// express object 
const app = express();

// middleware application 
app.use(express.json);

// mongodb connection 
mongoose.connect("mongodb://localhost:27017/authentication")
.then(()=>{console.log("MongoDB is Connected")})
.catch((err)=>{
    console.log(err);
})
app.listen(3000);

// schema for user 
const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String,required:true},
    password:{type:String,required:true}
},
{
    timestamps:true
});

// model for the user
const userModel = new mongoose.model("users",userSchema); 

// end point to register a user

app.post("/register",(req,res)=>{
    
    let user = req.body;
    let userOBJ = new userModel(user);

    userOBJ.save()
    .then(()=>{
        res.send({message:"User is Registered"})
    })
    .catch((err)=>{
        console.log(err);
        res.send({message:"Problem in creating the user"}) 
    })

})