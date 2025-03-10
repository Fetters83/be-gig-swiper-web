const axios  = require('axios');
const Buffer = require('buffer/').Buffer
const client_id = process.env.SPOTIFY_CLIENT_ID
const client_secret = process.env.SPOTIFY_CLIENT_SECRET
const position_stack_key = process.env.POSITION_STACK_KEY

function fetchLatitudeAndLongitude(location){
    const params = {
        access_key:position_stack_key,
        query:`${location}, UK`
    }
    return axios
    .get(`http://api.positionstack.com/v1/forward`,{params})
    .then(({data:{data}})=>{
        if(data.length === 0){
            return {msg:'no data'}
        }
       return { latitude: data[0].latitude, longitude: data[0].longitude};
    }).catch((err)=>{
        return err
    })
}

function getAllEvents(latitude, longitude, radius) {
    return axios
        .get(
            `https://www.skiddle.com/api/v1/events/search/?api_key=${process.env.SKIDDLE_KEY}/&`,
            { params: {
                    latitude: latitude,
                    longitude: longitude,
                    radius: radius,
                    limit: 100,
                    description:true
                },
            }
        )
        .then(({ data }) => {
            return data.results;
        }).catch((err)=>{
            return Promise.reject(err)
        });
}


function getSpotifyToken() {
    const url = 'https://accounts.spotify.com/api/token';
    const authOptions = {
        params: {
            client_id: client_id,
            client_secret: client_secret,
            grant_type: 'client_credentials'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    };

    return axios.post(url, null, authOptions)
    .then((response) => {
        console.log(response.data.access_token)
        return response.data.access_token;
    })
    .catch((error) => {
        console.log("in external api:",error)
        return Promise.reject(error)
    });
}

function fetchArtistId(spotifyToken, requiredArtistsName) {
    return axios.get(`https://api.spotify.com/v1/search`, {
        params: {
            q: requiredArtistsName,
            type: "artist",
            market: "GB",
            limit: 5,
            offset: 0
        },
        headers: {
            Authorization: `Bearer ${spotifyToken}`
        }
        }
    )
    .then((response) => {
        let artists = response.data.artists.items
        return getRequiredArtistId(requiredArtistsName, artists)
    })
    .catch((error) => {
        return Promise.reject(error)
    })
}


function getRequiredArtistId(requiredArtistsName, artists) {
    const matchingArtist = artists.filter((artist) => {
        return artist.name.toLowerCase() === requiredArtistsName.toLowerCase()
    });
    if (matchingArtist.length > 0) {
          return matchingArtist[0].id
    } else {
        return Promise.reject("no matching artist found")
    }
}


function fetchArtistTopTracks(spotifyToken, artistId) {
     return axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`, {
        params: {
            market: "GB",
        },
        headers: {
            Authorization: `Bearer ${spotifyToken}`
        }
        }
    )
    .then((response) => {
        console.log("120 fetchArtistTopTrack response",response.data.tracks)
          return {topTracks: response.data.tracks}
    })
    .catch((error) => {
        return Promise.reject(error)
    })
}


 function getArtistTopTrack(artistName,spotifyToken) {
    return fetchArtistId(spotifyToken, artistName)
    .then((artistId) => {
        console.log("131 - getArtistTopTrack artistId:",artistId)
     
        return fetchArtistTopTracks(spotifyToken, artistId)
    })
    .then(({ topTracks }) => {
    
         if(topTracks.length === 0){
           return Promise.reject({status:404,msg:'No track preview available.'})
         } 

         let topTrack = topTracks[1].preview_url
        return topTrack
    })
    .catch((error) => {
        return Promise.reject(error)
        
    })
}

function fetchDeezerPreviewTrack(artistName){
     return axios.get(`https://api.deezer.com/search/artist?strict=on&q=${artistName}`).then(({data})=>{
      let topTracksUrl = ''
  
        if(!data || !data.data || data.data.length === 0) {
            return Promise.reject({status:404,msg:'No track preview available.'})
        } else {
           topTracksUrl = data.data[0].tracklist
        }
        return axios.get(topTracksUrl) 
      
    }).then(({data})=>{
        if(!data.data || data.data.length === 0) {
            return Promise.reject({status:404,msg:'No track preview available.'})
        }
        const topTrackUrl = data.data[0].preview
        return topTrackUrl
    }).catch((err)=>{
      
        return Promise.reject(err)
    })
}

module.exports = {fetchLatitudeAndLongitude,getAllEvents,getSpotifyToken,getArtistTopTrack,fetchArtistId,fetchArtistTopTracks,getRequiredArtistId,fetchDeezerPreviewTrack}