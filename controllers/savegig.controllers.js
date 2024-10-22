const { insertSavedGig } = require("../models/savegig.models")

function postSavedGig(req,res,next){

    const{email,id,title,location,imageurl,description,eventname,doorsopening,doorsclosing,
        lastentry,date,town,postcode,link
    } = req.body;

    insertSavedGig(email,id,title,location,imageurl,description,eventname,doorsopening,doorsclosing,
        lastentry,date,town,postcode,link).then((response)=>{
       
        res.status(200).send(response)
    }).catch((err)=>{
        next(err)
    })
}

module.exports = {postSavedGig}