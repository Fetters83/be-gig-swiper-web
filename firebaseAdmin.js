const admin = require('firebase-admin')
const credentials = require('./serviceAccountKey.json')
const ENV = process.env.NODE_ENV || 'development';

require('dotenv').config({
  path: `${__dirname}/.env.${ENV}`,
});

    const firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(credentials),
        databaseURL: "https://gig-swiper-web.firebaseio.com",
        
       
    })

    const config={collection_id:process.env.COLLECTION_ID}; 
    const db = admin.firestore();
    module.exports = {
        firebaseAdmin,
        db,
        config
    };


