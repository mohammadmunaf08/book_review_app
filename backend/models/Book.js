const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: String,
  author: String,
  coverURL: String,
  status: { type: String, enum: ['to-read', 'reading', 'completed'], default: 'to-read' },
  rating: { type: Number, min: 1, max: 5 }
});

module.exports = mongoose.model('Book', BookSchema);
