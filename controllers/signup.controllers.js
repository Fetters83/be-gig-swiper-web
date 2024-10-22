const { insertNewUser } = require("../models/signup.models")


function postNewUser(req,res,next){
    const {email,password} = req.body;  
    insertNewUser(email,password).then((response)=>{
    res.status(200).send(response)
   }).catch((err)=>{
        next(err)
   }) 


}

module.exports = {postNewUser}