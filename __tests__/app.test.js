const request = require('supertest')
const admin = require('firebase-admin')
const {db} = require('../firebaseAdmin')
const app = require('../app')
const {deleteTestCollections,deleteUser} = require('../seed/seed-test')
const { toBeOneOf } = require('jest-extended')
require('jest-extended')

   beforeAll(()=>{
    const batchSize = 500
    const email  = 'wgyves@hotmail.com'.trim();
    return Promise.all([
        deleteTestCollections(batchSize),
        deleteUser(email)
    ])
}
)    

 describe('/api/signup',()=>{
    test('POST 200 and 400: Signing up with email and password returns status 200, duplicate signups returns 400 with an error message',()=>{
        const userRecord = {
            email:'wgyves@hotmail.com',
            password:'password1',
            emailVerified:false,
            disabled:false
        }
       return request(app)
       .post('/api/signup')
       .expect(200)
       .send(userRecord)
       .then(({body})=>{
        expect(body.msg).toBe('User created successfully')
        expect(body.user).toEqual(
            expect.objectContaining({
                uid:expect.any(String),
                email:expect.any(String),
                emailVerified:expect.any(Boolean),
                disabled: expect.any(Boolean)
            })
        )
         return request(app)
        .post('/api/signup')
        .expect(400)
        .send(userRecord)
        .then(({body})=>{
            expect(body.msg).toBe('The email address is already in use by another account.')
        }) 
       
    })
    })
    test('POST 400: Signing up with an email address of an invalid data type responds with a 400 status and an error message',()=>{
        const userRecord = {
            email:9999,
            password:'password1',
            emailVerified:false,
            disabled:false
        }
        return request(app)
        .post('/api/signup')
        .expect(400)
        .send(userRecord)
        .then(({body})=>{
            expect(body.msg).toBe('Invalid email address provided')
        })
    })
    test('POST 400: Signing up with a password of an invalid data type responds with a 400 status and an error message',()=>{
        const userRecord = {
            email:'wgyves@hotmail.com',
            password:9999,
            emailVerified:false,
            disabled:false
        }
        return request(app)
        .post('/api/signup')
        .expect(400)
        .send(userRecord)
        .then(({body})=>{
            expect(body.msg).toBe('The password must be a string with at least 6 characters.')
        })
    })
    test('POST 400: Signing up with a email address that is blank or has empty space responds with a 400 status and an error message',()=>{
        const userRecord = {
            email:'',
            password:9999,
            emailVerified:false,
            disabled:false
        }
        return request(app)
        .post('/api/signup')
        .expect(400)
        .send(userRecord)
        .then(({body})=>{
            expect(body.msg).toBe('Invalid email address provided')
        })
    })
    test('POST 400: Signing up with a password that is blank or has empty space responds with a 400 status and an error message',()=>{
        const userRecord = {
            email:'wgyves@hotmail.com',
            password:' ',
            emailVerified:false,
            disabled:false
        }
        return request(app)
        .post('/api/signup')
        .expect(400)
        .send(userRecord)
        .then(({body})=>{
            expect(body.msg).toBe('The password must be a string with at least 6 characters.')
        })
    })
    
})

describe('/api/saveGig',()=>{
    test('POST 200: saving a gig with all the correct fields should return 200 status and insert the gig into the database',()=>{
        const likedGigObj = {
            email:'wgyves@hotmail.com',
            id:1,
            title:'gig 1',
            location:'Manchester Bar',
            imageurl:'www.url.com',
            description:'test gig',
            eventname:'test event',
            doorsopening:'19:00',
            doorsclosing:'00:00',
            lastentry:'22:00',
            date:'08-10-2024',
            town:'Manchester',
            postcode:'M1 8ND',
            link:'test link'
        }

        return request(app)
        .post('/api/saveGig')
        .expect(200)
        .send(likedGigObj)
        .then(({body})=>{
            expect(body.msg).toBe('Gig saved successfully')
            expect(body.savedGig).toEqual(
                expect.objectContaining({
                    id: expect.any(Number),
                    title:expect.any(String),
                    location:expect.any(String),
                    imageurl:expect.any(String),
                    description:expect.any(String),
                    eventname:expect.any(String),
                    doorsopening:expect.any(String),
                    doorsclosing:expect.any(String),
                    lastentry:expect.any(String),
                    date:expect.any(String),
                    town:expect.any(String),
                    postcode:expect.any(String),
                    link:expect.any(String),
                    
                })
            )
        })

    })
    test('POST 400: Saving a gig with any of the fields missing should return status 400 and an error message',()=>{
        const likedGigObj = {
            email:'wgyves@hotmail.com',
            id:2,
            title:'',
            location:'Leeds Bar',
            imageurl:'www.url.com',
            description:'test gig',
            eventname:'test event',
            doorsopening:'19:00',
            doorsclosing:'00:00',
            lastentry:'22:00',
            date:'08-10-2024',
            town:'Leeds',
            postcode:'LS1 4BH',
            link:'test link'
        }
        return request(app)
        .post('/api/saveGig')
        .expect(400)
        .send(likedGigObj)
        .then(({body})=>{
            expect(body.msg).toBe('There has been an error saving this gig')
        })
    })
}) 

describe('/api/gigSearch/:stacknumber>',()=>{
    test('POST 200: gig search should return an object with gig info and spotify track info if an aritst name is found in the spotify api',()=>{
        const locationObj={location:'Manchester',radius:10}
        return request(app)
        .post('/api/gigSearch/10')
        .expect(200)
        .send(locationObj)
        .then(({body})=>{
                    expect(body).toEqual(
                    expect.objectContaining({
                    eventname: expect.any(String),
                    venue: expect.any(String),
                    date: expect.any(String),
                    entryprice: expect.toBeOneOf([null,expect.any(String)]),
                    uri: expect.any(String),
                    description: expect.any(String),
                    doorsopen: expect.any(String),
                    doorsclose: expect.any(String),
                    postcode: expect.any(String),
                    town: expect.any(String),
                    link: expect.any(String),
                    artistname: expect.toBeOneOf([null,expect.any(String)])
                })

                
            )
            
        })
        
    })

    test('POST 404: if a location parameter of an invalid data is submitted a status of 404 is returned and an error message',()=>{
        const locationObj={location:9999,radius:10}
        return request(app)
        .post('/api/gigSearch/1')
        .expect(404)
        .send(locationObj)
        .then(({body})=>{
           expect(body.msg).toBe('Location must be a valid string.')
        })
    }) 
    test('POST 404: if a valid string location parameter is submitted but no gigs are found, then a status of 204 is returned with a message',()=>{
        const locationObj={location:'SmileyTown',radius:10}
        return request(app)
        .post('/api/gigSearch/1')
        .expect(404)
        .send(locationObj)
        .then(({body})=>{
            expect(body.msg).toBe('No events found in this location')
        })
    })
    test('Post 404: if a blank or whitespaced location is submitted, a status of 404 is returned with an error message',()=>{
    const locationObj = {location:'',radius:10}
    return request(app)
    .post('/api/gigSearch/1')
    .expect(404)
    .send(locationObj)
    .then(({body})=>{
        expect(body.msg).toBe('Location can not be blank.')
    })
    })
})

