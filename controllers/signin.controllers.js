const { insertCredentials } = require("../models/signin.models");

function postCredentials(req,res,next) {

    insertCredentials().then((response)=>{
        res.status(200).send(response)
    })
}

module.exports = {postCredentials}