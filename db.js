const mongoose = require('mongoose');

module.exports = async function db() {
  try {
    await mongoose.connect(process.env.MONGO_URI); //process.env.NODE_ENV == 'development' ? 'mongodb://127.0.0.1:27017/icctlms' : process.env.MONGO_URI
    console.log('Database connected!');
    // console.log(process.env.MONGO_URI)
  } catch (err) {
    console.log(err.message);
  }
}
