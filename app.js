const express = require('express');
const cors = require('cors');
const app = express();
const {postNewUser} = require('./controllers/signup.controllers');
const { postCredentials } = require('./controllers/signin.controllers');
const { postSavedGig } = require('./controllers/savegig.controllers');
const { getGigs } = require('./controllers/gigSearch.controllers');



app.use(cors());
app.use(express.json());

app.post('/api/signup',postNewUser)
app.post('api/signin',postCredentials)
app.post('/api/saveGig',postSavedGig)
app.post('/api/gigSearch/:stackNumber',getGigs)


app.use((err,req,res,next)=>{
  

    if(err.msg){
        if(err.status===400){
          
            res.status(400).send({status:400,msg:err.msg})
        }
        if(err.status===404){
          
            res.status(404).send({status:404,msg:err.msg})
        }
       
    }
})


app.all('*',(req,res,next)=>{
    res.status(404).send({msg:'endpoint not found'})
})

module.exports= app;



