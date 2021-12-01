// import the express & formidable library
const express = require('express');
const formidable = require('formidable');
const fs = require('fs');

// create object
const app = express();

//middle ware function 
app.use(express.json());

// Create an end-point
app.post("/create",(req,res)=>{
  
    //for handling new request .i.e file/data we need to create a formidale object 
    // here we are sure we will reciving a file
    const form = new formidable.IncomingForm();

    console.log(req.headers);
    
    // we simply parse incoming request by using parse() method by passing req 
    form.parse(req,(err,body,files)=>{

        let extension = files.picture.originalFilename.split(".")[1];

        console.log(body);
        fs.rename(files.picture.filepath,"./uploads/"+files.picture.newFilename+"."+extension,(err)=>{
            if(err===null){
                res.send({message:"Everything works"});
            }
        }); 
        
    })
})

app.listen(3000);

