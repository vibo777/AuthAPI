const express = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');


// express object 
const app = express();

// middleware application 
app.use(express.json());

// mongodb connection 
mongoose.connect("mongodb://localhost:27017/authentication")
.then(()=>{console.log("MongoDB is Connected")})
.catch((err)=>{
    console.log(err);
})


// schema for user 
const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String,required:true,unique:true},
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

    //  it will convert normal textual password into encrypted one  
    //  (genSalt) this function tell's us how many round you want to do & it will generate random salt i.e mixture  

    bcryptjs.genSalt(10,(err,salt)=>{

        
        if(err===null){
            // pass old password , salt it will give newpassword
            bcryptjs.hash(user.password,salt,(err,newpassword)=>{
           
                // updated it with old password
                user.password = newpassword;

                // save the new encrypted password in database 
                
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
        }
    })

})


app.listen(3000);







