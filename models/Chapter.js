const mongoose = require('mongoose');
const marked = require('marked');
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const chapterSchema = new mongoose.Schema({
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
  title: String,
  lesson: String,
  markedHtml: String
});

chapterSchema.pre('validate', function(next) {
  if (this.lesson) {
    this.markedHtml = dompurify.sanitize(marked.parse(this.lesson));
  }
  next();
})

module.exports = mongoose.model('Chapter', chapterSchema);
