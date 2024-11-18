
const { fetchLatitudeAndLongitude, getAllEvents, getSpotifyToken, getArtistTopTrack } = require('../externalApi');

function fetchGigs(location,radius){
    let gigStack={};
    let gigInfo
    const regexBlankSpace = /^\S+$/

    if(typeof location != 'string'){
        return Promise.reject({status:404,msg:'Location must be a valid string.'})
    }
   
    if(regexBlankSpace.test(location)===false){
        return Promise.reject({status:404,msg:'Location can not be blank.'})
    }

    return fetchLatitudeAndLongitude(location).then((response)=>{
       if(response.msg === 'no data'){
        return Promise.reject({status:404,msg:'No events found in this location'})
       }
        return response
    }).then(({latitude,longitude})=>{
        
       
        return getAllEvents(latitude,longitude,radius || 5)
    }).then((gigs)=>{
        if(gigs.length===0){
            return Promise.reject({status:404,msg:'No events found in this location'})
        }
        return gigs
    })
    

}

module.exports = {fetchGigs}