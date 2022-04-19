const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  title: String,
  lesson: String
});

const subjectSchema = new mongoose.Schema({
  year: String,
  semester: String,
  code: String,
  title: String,
  units: Number,
  prerequisite: String,
  chapters: [chapterSchema]
});

module.exports = mongoose.model('Subject', subjectSchema);
