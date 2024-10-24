
const { fetchLatitudeAndLongitude, getAllEvents, getSpotifyToken, getArtistTopTrack } = require('../externalApi');

function fetchGigs(stackNumber,location,radius){

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
        gigInfo = gigs[stackNumber];     
        gigStack.eventname=gigInfo.eventname  || null
        gigStack.venue=gigInfo.venue.name|| null
        gigStack.date=gigInfo.date|| null
        gigStack.entryprice=gigInfo.entryprice|| null
        gigStack.uri=gigInfo.xlargeimageurl|| null
        gigStack.description=gigInfo.description|| null
        gigStack.date=gigInfo.date|| null
        gigStack.doorsopen=gigInfo.openingtimes.doorsopen|| null
        gigStack.doorsclose=gigInfo.openingtimes.doorsclose|| null
        gigStack.postcode=gigInfo.venue.postcode|| null
        gigStack.town=gigInfo.venue.town|| null
        gigStack.link=gigInfo.link|| null
        gigStack.artistname= gigInfo.artists.length > 0 ? gigInfo.artists[0].name:null
        
            if(gigStack.artistname === null){
               return Promise.resolve({gigStack})
            }

        return gigStack
    }).then((result)=>{
        if (gigStack.artistname === null) return result;
        return getSpotifyToken()
    }).then((accessToken)=>{
        if (gigStack.artistname === null) return gigStack;
        gigStack.spotifyToken = accessToken    
          return gigStack
    }).then(()=>{
        if (gigStack.artistname === null) return gigStack;
        const artistName = gigStack.artistname
        const spotifyAccessToken = gigStack.spotifyToken
         return getArtistTopTrack(artistName,spotifyAccessToken) 
    }).then((topTrack)=>{
        
        if (gigStack.artistname === null) return gigStack;
        gigStack.preview_url = topTrack.preview_url
        
        return gigStack
    })
    

}

module.exports = {fetchGigs}