const express = require('express');
const mongoose = require('mongoose');

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