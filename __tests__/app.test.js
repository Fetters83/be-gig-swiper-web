const request = require('supertest')
const app = require('../app')
const {deleteTestCollections} = require('../seed/seed-test')
require('jest-extended')


        beforeAll(()=>{
            const batchSize = 500;
            return deleteTestCollections(batchSize)
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
    test('POST 400: Saving a gig without the id field should return status 400 and an error message',()=>{
        const likedGigObj = {
            email:'wgyves@hotmail.com',
            id:'',
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
            expect(body.msg).toBe('Gig ID is required')
        })
    })
}) 

describe('/api/gigSearch',()=>{
    test('POST 200: gig search should return an object with gig info and spotify track info if an aritst name is found in the spotify api',()=>{
        const locationObj={location:'Manchester',radius:10}
        return request(app)
        .post('/api/gigSearch')
        .expect(200)
        .send(locationObj)
        .then(({body})=>{
           expect(Array.isArray(body)).toBe(true)
           expect(typeof body[0].eventname).toBe('string')
           expect(typeof body[0].venue.name).toBe('string')
           expect(typeof body[0].venue.address).toBe('string')
           expect(typeof body[0].venue.town).toBe('string')
           expect(typeof body[0].venue.postcode).toBe('string')
           expect(typeof body[0].venue.latitude).toBe('number')
           expect(typeof body[0].venue.longitude).toBe('number')
           expect(typeof body[0].link).toBe('string')
           expect(typeof body[0].description).toBe('string')
           expect(typeof body[0].openingtimes).toBe('object')         
        })
        
    })

    test('POST 404: if a location parameter of an invalid data is submitted a status of 404 is returned and an error message',()=>{
        const locationObj={location:9999,radius:10}
        return request(app)
        .post('/api/gigSearch')
        .expect(404)
        .send(locationObj)
        .then(({body})=>{
           expect(body.msg).toBe('Location must be a valid string.')
        })
    }) 
    test('POST 404: if a valid string location parameter is submitted but no gigs are found, then a status of 204 is returned with a message',()=>{
        const locationObj={location:'Rhiwargor',radius:10}
        return request(app)
        .post('/api/gigSearch')
        .expect(404)
        .send(locationObj)
        .then(({body})=>{
                    expect(body.msg).toBe('No events found in this location')
        })
    })
    test('Post 404: if a blank or whitespaced location is submitted, a status of 404 is returned with an error message',()=>{
    const locationObj = {location:'',radius:10}
    return request(app)
    .post('/api/gigSearch')
    .expect(404)
    .send(locationObj)
    .then(({body})=>{
        expect(body.msg).toBe('Location can not be blank.')
    })
    })
})


        describe('/api/getPreviewTrack',()=>{
            test.only('POST 200: Should return an artist top track preview URL from Spotify',()=>{
                //const artistNameObj = {artistName: 'Taylor Swift'}
                return request(app)
                .get('/api/getPreviewTrack?q=Non Phixion')
                .expect(200)
                .then(({body:{previewTrackUrl}})=>{
                    
                                   expect(typeof previewTrackUrl).toBe('string') 
                })
            })
            test.only('POST 404: If artist name does not produce a preview url, then a status of 404 is returned to the server',()=>{
                
                return request(app)
                .get('/api/getPreviewTrack?q=NOTANARTISTS')
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('No track preview available.') 
                })
            })
            test.only('POST 404: If artist name is not of the correct data type, return status of 404 and an error message',()=>{
                   return request(app)
                .get('/api/getPreviewTrack?q= ')
                .expect(404)
                .then(({body})=>{
                    expect(body.msg).toBe('Artist name must be provided.') 
                })
            })

describe('/api/getLikedGigs/:userEmail',()=>{
    test('GET 200: If a valid user email address is submitted, the server will respond with an array containing all the users liked gigs',()=>{
            const likedGigObj = {
                email:'wgyves@hotmail.com',
                id:3,
                title:'Leeds Event',
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
            .expect(200)
            .send(likedGigObj)
            .then(()=>{
                
                return request(app)
                .get('/api/GetLikedGigs/wgyves@hotmail.com')
                .expect(200)
                .then(({body})=>{
                    expect(Array.isArray(body)).toBe(true)
                    expect(typeof body[0].id).toBe('number')
                    expect(typeof body[0].title).toBe('string')
                    expect(typeof body[0].location).toBe('string')
                    expect(typeof body[0].imageurl).toBe('string')
                    expect(typeof body[0].description).toBe('string')
                    expect(typeof body[0].eventname).toBe('string')
                    expect(typeof body[0].doorsopening).toBe('string')
                    expect(typeof body[0].doorsclosing).toBe('string')
                    expect(typeof body[0].lastentry).toBe('string')
                    expect(typeof body[0].date).toBe('string')
                    expect(typeof body[0].town).toBe('string')
                    expect(typeof body[0].postcode).toBe('string')
                    expect(typeof body[0].link).toBe('string')        
                })
            })
        })
        test('GET 200: If no liked gigs are saved against the users email, then an empty array is returned',()=>{
            return request(app)
            .get('/api/getLikedGigs/notanemail@email.com')
            .expect(200)
            .then(({body})=>{
                expect(Array.isArray(body)).toBe(true)
                expect(body.length).toBe(0)
            })
        })
        test('GET 400: If user email is not a valid email address syntax a staus of 400 is returned with an an error message',()=>{
            return request(app)
            .get('/api/getLikedGigs/NOTANEMAIL')
            .expect(400)
            .then(({body})=>{
                expect(body.msg).toBe('Invalid email address provided.')
            })
        })
    })
})
describe('/api/removeGig/:userEmail&id=eventid',()=>{
    test('DELETE 200: when a gig valid gig id is presented and deleted from the liked gigs array the server responds with 200',()=>{
        return request(app)
        .delete('/api/removeGig/wgyves@hotmail.com?id=3')
        .expect(200)
        .then(({body:removedGig})=>{
            expect(removedGig.msg).toBe('Gig successfully deleted.')
        })
    })
    test('DELETE 400: when a gig id to be deleted is provided which does not exists in the array a status of 400 is returned with an error message',()=>{
        return request(app)
        .delete('/api/removeGig/wgyves@hotmail.com?id=9999')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Gig not found in likedgigs array.')
        })
    })
    test('DELETE 400: when an invalid gig id to be deleted is provided which does not exists in the array a status of 400 is returned with an error message',()=>{
        return request(app)
        .delete('/api/removeGig/wgyves@hotmail.com?id=XXXX')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('Gig id not valid.')
        })
    })
    test('DELETE 400: when an email provided as a document id to delete a gig does not exist a status of 400 is returned with an error message',()=>{
        return request(app)
        .delete('/api/removeGig/bgyves@hotmail.com?id=1')
        .expect(400)
        .then(({body})=>{
            expect(body.msg).toBe('User doc does not exist.')
        })
    })
})

