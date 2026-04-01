const mongoose = require('mongoose');

const viewSchema = new mongoose.Schema({
  type:  { type: String, enum: ['iframe', 'image', 'aframe'], required: true },
  src:   { type: String, required: true },
  order: { type: Number, default: 0 }
});

const translationSchema = new mongoose.Schema({
  languageCode: { type: String, required: true },
  name:         { type: String, required: true },
  location:     { type: String, required: true },
  festival:     { type: String, required: true },
  description:  { type: String, required: true }
});

const monasterySchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  location:    { type: String, required: true },
  founded:     { type: String, required: true },
  festival:    { type: String, required: true },
  description: { type: String, required: true },
  image:       { type: String, required: true },
  link:        { type: String, required: true },
  audioGuideText: {
    en: { type: String, default: '' },
    hi: { type: String, default: '' },
    ne: { type: String, default: '' },
    bo: { type: String, default: '' },
    zh: { type: String, default: '' }
  },
  audio: {
    en: { type: String, default: '' },
    hi: { type: String, default: '' },
    ne: { type: String, default: '' },
    bo: { type: String, default: '' },
    zh: { type: String, default: '' }
  },
  views:        [viewSchema],
  videos:       [String],
  translations: [translationSchema],
  coordinates: {
    latitude:  Number,
    longitude: Number
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

monasterySchema.index({ name: 'text', location: 'text', festival: 'text' });

module.exports = mongoose.models.Monastery || mongoose.model('Monastery', monasterySchema);
