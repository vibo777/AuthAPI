const express = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

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


// for login functionality 
// 1. First check if username is correct 
// 2. Whatever username & password pass in body it will store in userCred  

app.post("/login",(req,res)=>{

    // Whatever username & password pass in body it will store in userCred 
    let userCred = req.body;

    // we try to find person with that username 
    userModel.findOne({username:userCred.username})
    .then((user)=>{
        // if we found username, if block will executed 
        if(user!=null){

            // we are checking the previous encrypted password with new encrypted password using bcryptjs.compare() method  
            bcryptjs.compare(userCred.password,user.password,(err,status)=>{
                if(status === true){
        
                   jwt.sign(userCred,"secretkey",(err,token)=>{
                        if(err===null){
                            res.send({message:"welcome user",token:token});
                        }
                   })   
                }
                else{
                    res.send({message:"Password don't match"})
                }    
            })

        }  
        // if we don't found username else block executed 
        else{
            res.send({message:"User is not found"});
        }     
    })
    .catch((err)=>{
        console.log(err);
        res.send({message:"Some problem"});
    })
})

app.get("/dummy",(req,res)=>{

    res.send({message:"Some really important code"});

})



app.listen(3000);







