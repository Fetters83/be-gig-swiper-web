/* const admin = require('firebase-admin')
const credentials = require('../serviceAccountKey.json')

admin.initializeApp({
    credential: admin.credential.cert(credentials)
   
}) */

const {firebaseAdmin} = require('../firebaseAdmin')


function insertNewUser(email,password){

    const regexEmailFormat = /^[^@]+@[^@]+\.[a-z]{2,}(\.[a-z]{2,})?$/
    const regexPasswordFormat = /^\S+$/
    if(typeof email === 'number' || regexEmailFormat.test(email) === false ){
        return Promise.reject({status:400,msg:'Invalid email address provided'})
    }

    if(typeof password === 'number' || regexPasswordFormat.test(password) === false ){
        return Promise.reject({status:400,msg:'The password must be a string with at least 6 characters.'})
    }

    

    
   const user = {
    email:email,
    password:password 
   }
   return userRecord = firebaseAdmin.auth().createUser({
    email:user.email,
    password:user.password,
    emailVerified:false,
    disabled:false,
   }).then((userRecord)=>{
    return {msg:'User created successfully',user:userRecord}
   }).catch((err)=>{
    return Promise.reject({status:400,msg:err.message})
   })

}


module.exports = {insertNewUser}