const mongoose = require('mongoose');

const festivalSchema = new mongoose.Schema({
  name:        { type: String, required: [true, 'Festival name is required'], trim: true, maxlength: 100 },
  date:        { type: Date, required: [true, 'Festival date is required'] },
  time:        { type: String, default: 'All Day' },
  description: { type: String, required: [true, 'Description is required'], maxlength: 500 },
  location:    { type: String, maxlength: 100 },
  monastery:   { type: mongoose.Schema.Types.ObjectId, ref: 'Monastery' }
}, { timestamps: true });

module.exports = mongoose.model('Festival', festivalSchema);
