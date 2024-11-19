const { deleteGig } = require("../models/removeGig.models");

function removeGig(req,res,next){
    const {userEmail} = req.params
    const{id} = req.query
    deleteGig(userEmail,id).then((response)=>{
        return res.status(200).send(response)
    }).catch((error)=>{
        next(error)
    })

}

module.exports = {removeGig}