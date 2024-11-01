const { getArtistTopTrack, getSpotifyToken } = require("../externalApi")

function fetchSpotifyTrack(artistName){

   if(typeof artistName != 'string'){
      return Promise.reject({status:404,msg:'Artist name can not be a number.'})
   }

   return getSpotifyToken().then((spotifyToken)=>{
    return spotifyToken
   }).then((spotifyToken)=>{
    return getArtistTopTrack(artistName,spotifyToken)
   }).then((topTrack)=>{
    return topTrack
   }).catch((error)=>{
      return Promise.reject(error)
   })
    


}

module.exports = {fetchSpotifyTrack}