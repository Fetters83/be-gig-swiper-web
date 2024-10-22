const { fetchGigs } = require("../models/gigSearch.model")

function getGigs(req,res,next){
const{location} = req.body
const {stackNumber} = req.params

fetchGigs(stackNumber,location).then((gigStack)=>{
    res.status(200).send(gigStack)
}).catch((err)=>{
   next(err)
})

}

module.exports = {getGigs}