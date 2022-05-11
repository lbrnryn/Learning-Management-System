const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  year: String,
  semester: String,
  code: String,
  title: String,
  units: Number,
  prerequisite: String
});

module.exports = mongoose.model('Subject', subjectSchema);
