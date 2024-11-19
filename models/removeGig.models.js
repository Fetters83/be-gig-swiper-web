const admin = require('firebase-admin')
const {config} = require('../firebaseAdmin')
const {db} = require('../firebaseAdmin')
const collection_id = config.collection_id


function deleteGig(email,id){

    const userDocRef = db.collection(collection_id).doc(email)
    
    return userDocRef.get()
        .then(userDoc => {
           
            if (!userDoc.exists) {
                return Promise.reject({status:400,msg:'User doc does not exist.'})
            }

            const userData = userDoc.data();
            
            const likedGigs = userData.likedgigs || [];
          
            if(!Number(id)){
                return Promise.reject({status:400,msg:'Gig id not valid.'});
            }
           
            const gigToRemove = likedGigs.find(gig =>
                gig.id === Number(id)
             );

            if (!gigToRemove) {
                console.log('in !gigToRemove')
                return Promise.reject({status:400,msg:'Gig not found in likedgigs array.'});
            }

            // Remove the gig using arrayRemove
            return userDocRef.update({
                likedgigs: admin.firestore.FieldValue.arrayRemove(gigToRemove),
            });
        })
        .then(() => {
            const removedGig={
                status:200,
                removedId:id,
                msg:'Gig successfully deleted.'
            }
            return removedGig
        })
        .catch((error) => {
           return Promise.reject(error)
        });
}


module.exports = {deleteGig}