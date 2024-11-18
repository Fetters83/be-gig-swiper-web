const { fetchGigs } = require("../models/gigSearch.model")

function getGigs(req,res,next){
const{location} = req.body
const{radius} = req.body
fetchGigs(location,radius).then((gigStack)=>{
    res.status(200).send(gigStack)
}).catch((err)=>{
   next(err)
})

}

module.exports = {getGigs}