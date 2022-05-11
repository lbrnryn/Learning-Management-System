const mongoose = require('mongoose');
// const mongodb = require('mongodb');

async function mongoosedb() {
  try {
    await mongoose.connect(process.env.NODE_ENV == 'development' ? 'mongodb://127.0.0.1:27017/icctlms' : process.env.MONGO_URI);
    console.log('Database connected!');
    // console.log(mongoose.mongo)
  } catch (err) {
    console.log(err.message);
  }
}



// const client = new mongodb.MongoClient(process.env.NODE_ENV == 'development' ? 'mongodb://127.0.0.1:27017/icctlms' : process.env.MONGO_URI)
//
// async function run() {
//   try {
//     await client.connect();
//     const db = await client.db(process.env.NODE_ENV == 'development' ? "icctlms" : "myFirstDatabase");
//     const bucket = new mongodb.GridFSBucket(db, { bucketName: 'images' });
//     // bucket.openUploadStream('myFile', {
//     //      chunkSizeBytes: 1048576,
//     //      metadata: { field: 'myField', value: 'myValue' }
//     //  })
//     // console.log(bucket)
//   } catch (err) {
//     console.log(err.message)
//   } finally {
//     // await client.close()
//   }
// }

// run()
module.exports = {
  mongoosedb
}
