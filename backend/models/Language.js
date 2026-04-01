const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
  code:       { type: String, required: true, unique: true },
  name:       { type: String, required: true },
  nativeName: { type: String, required: true },
  flagEmoji:  { type: String, required: true },
  isActive:   { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Language', languageSchema);
