const express = require('express');
const cors = require('cors');
const app = express();
const { postSavedGig } = require('./controllers/savegig.controllers');
const { getGigs } = require('./controllers/gigSearch.controllers');
const { getSpotifyTrack } = require('./controllers/getSpotifyTrack.controllers');
const { getLikedGigs } = require('./controllers/getLikedGigs.controllers');
const { removeGig } = require('./controllers/removeGig.controllers');
const { getPreviewTrack } = require('./controllers/getPreviewTrack.controller');



app.use(cors());
app.use(express.json());

app.post('/api/saveGig',postSavedGig)
app.post('/api/gigSearch',getGigs)
app.post('/api/getSpotifyTrack',getSpotifyTrack)
app.get('/api/getLikedGigs/:userEmail',getLikedGigs)
app.delete('/api/removeGig/:userEmail',removeGig)
app.get('/api/getPreviewTrack',getPreviewTrack)


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



