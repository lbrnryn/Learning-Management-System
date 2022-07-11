const mongoose = require('mongoose');

async function mongoosedb() {
  try {
    await mongoose.connect(process.env.NODE_ENV == 'development' ? 'mongodb://127.0.0.1:27017/lms' : process.env.MONGO_URI);
    console.log('Database connected!');
  } catch (err) { console.log(err.message) }
  // } catch (err) { next(err) }
}

mongoosedb()
