const { fetchSpotifyTrack } = require("../models/getSpotifyTrack.models")

function getSpotifyTrack(req,res,next){
    const {artistName} = req.body
    return fetchSpotifyTrack(artistName).then((topTrack)=>{
           res.status(200).send({spotifyTrack:{topTrack}})
    }).catch((error)=>{
        next(error)
    })
}

module.exports = {getSpotifyTrack}