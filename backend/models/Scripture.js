const mongoose = require('mongoose');

const scriptureSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  type:         { type: String, required: true },
  description:  { type: String, default: '' },
  origin:       { type: String, default: '' },
  significance: { type: String, default: '' },
  src:          { type: String, required: true },
  source:       { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Scripture', scriptureSchema);
