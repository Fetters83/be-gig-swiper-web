const { fetchPreviewTrack } = require("../models/getPreviewTrack.model")

function getPreviewTrack(req,res,next) {
    const {q} = req.query

    return fetchPreviewTrack(q).then((previewTrackUrl)=>{
        res.status(200).send({previewTrackUrl})
    }).catch((err)=>{
    
        if (err.status) {
            res.status(err.status).send({ msg: err.msg });
        } 
    })
}

module.exports = {getPreviewTrack}