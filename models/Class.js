const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  name: String
});

const classSchema = new mongoose.Schema({
  section: sectionSchema,
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  student: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  day: String,
  timeStart: String,
  timeEnd: String,
  room: String
});

module.exports = mongoose.model('Class', classSchema);
