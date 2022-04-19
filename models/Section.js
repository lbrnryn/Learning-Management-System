const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: String
});

module.exports = mongoose.model('Section', sectionSchema);
