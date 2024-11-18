/* const admin = require('firebase-admin')
const credentials = require('../serviceAccountKey.json')

admin.initializeApp({
    credential: admin.credential.cert(credentials),
     databaseURL: "https://gig-swiper-web.firebaseio.com"
})

const db = admin.firestore(); */
const admin = require('firebase-admin')
const {config} = require('../firebaseAdmin')
const {db} = require('../firebaseAdmin')
const collection_id = config.collection_id


function insertSavedGig(email,id,title,location,imageurl,description,eventname,doorsopening,doorsclosing,
    lastentry,date,town,postcode,link){

                const likedGigObj = {
            id:id || '',
            title:title || '',
            location:location || '',
            imageurl:imageurl || '',
            description:description || '',
            eventname:eventname || '',
            doorsopening:doorsopening || '',
            doorsclosing:doorsclosing || '',
            lastentry:lastentry || '',
            date:date || '',
            town:town|| '',
            postcode:postcode || '',
            link:link || ''
        }
        
     if(!id){
        return Promise.reject({ status: 400, msg: 'Gig ID is required' });
     }
        const docRef = db.collection(collection_id).doc(email)

        return docRef.update({
            likedgigs:admin.firestore.FieldValue.arrayUnion(likedGigObj)
        }).then(()=>{
            
            return {message:'Gig saved successfully',savedGig:likedGigObj}
        }).catch((err)=>{
            if(err.code === 5){
                return docRef.set({
                    likedgigs: [likedGigObj]
                }).then(()=>{
                    return { msg: 'Gig saved successfully', savedGig: likedGigObj };
                })
            }
        })
}

module.exports = {insertSavedGig}