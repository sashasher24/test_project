const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  model: String,
  year: Number,
});

module.exports = mongoose.model('Car', CarSchema);