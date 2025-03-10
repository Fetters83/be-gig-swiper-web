const { fetchDeezerPreviewTrack } = require("../externalApi")

function fetchPreviewTrack(artistName){

    if(artistName.length === 0 || artistName === "") {
        return Promise.reject({status:404,msg:'Artist name must be provided.'})
    }

    return fetchDeezerPreviewTrack(artistName).then((topTrackUrl)=>{
          return topTrackUrl
    }).catch((error)=>{
        return Promise.reject(error)
    })
}

module.exports = {fetchPreviewTrack}