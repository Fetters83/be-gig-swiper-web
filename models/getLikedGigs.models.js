const admin = require('firebase-admin')
const {config} = require('../firebaseAdmin')
const {db} = require('../firebaseAdmin')
const collection_id = config.collection_id


function fetchLikedGigs(userEmail) {

    const regexEmailFormat = /^[^@]+@[^@]+\.[a-z]{2,}(\.[a-z]{2,})?$/

    if(typeof userEmail === 'number' || regexEmailFormat.test(userEmail) === false ){
        return Promise.reject({status:400,msg:'Invalid email address provided.'})
    }

    return new Promise((resolve, reject) => {
      if (!userEmail) {
        return resolve([]);
      }
  
      const userDocRef = db.collection(collection_id).doc(userEmail);
  
      userDocRef.get()
        .then(userDoc => {
          if (userDoc.exists) {
            const likedGigs = userDoc.data().likedgigs || [];
            resolve(likedGigs); 
          } else {
            resolve([]); 
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  
  module.exports = { fetchLikedGigs };