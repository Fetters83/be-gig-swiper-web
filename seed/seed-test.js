const {db,firebaseAdmin} = require('../firebaseAdmin')

function deleteCollection(collectionPath,batchSize){
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize)
    return deleteQueryBatch(query,batchSize)
}

function deleteQueryBatch(query,batchSize){
    return query.get().then((snapshot)=>{
        if(snapshot.size===0){
            return Promise.resolve();
        }

     const batch = db.batch();
     snapshot.docs.forEach((doc)=>{
        batch.delete(doc.ref)
     })   

     return batch.commit().then(()=>{
        if(snapshot.size === batchSize){
            return deleteQueryBatch(query,batchSize)
        } else{
            return Promise.resolve();
        }
     })
    })
  
}

function deleteTestCollections(batchSize){
    return db.listCollections().then((collections)=>{
        const testCollections = collections.filter((col)=>
            col.id.includes('test')
        );

    return testCollections.reduce((promiseChain, collection)=>{
        return promiseChain.then(()=>{
            return deleteCollection(collection.id,batchSize)
        });
        
    },Promise.resolve());
    }).then(()=>{
        return true;
    }).catch((err)=>{
        return err
    })
}

module.exports = {deleteTestCollections}