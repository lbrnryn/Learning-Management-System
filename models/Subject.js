const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  year: String,
  trimester: String,
  code: String,
  title: String,
  units: Number,
  prerequisite: String
}, { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);
