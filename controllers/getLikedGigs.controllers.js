const { fetchLikedGigs } = require("../models/getLikedGigs.models")

function getLikedGigs(req,res,next){
const {userEmail} = req.params 
    fetchLikedGigs(userEmail).then((data)=>{
       res.status(200).send(data)
    }).catch((error)=>{
        next(error)
    })
}
module.exports = {getLikedGigs}