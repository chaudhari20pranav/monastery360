const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name:              { type: String, required: [true, 'Name is required'], trim: true },
  email:             { type: String, required: [true, 'Email is required'], trim: true, lowercase: true },
  phone:             { type: String, required: [true, 'Phone number is required'] },
  monastery:         { type: mongoose.Schema.Types.ObjectId, ref: 'Monastery', required: [true, 'Monastery is required'] },
  travelDate:        { type: Date, required: [true, 'Travel date is required'] },
  numberOfTravelers: { type: Number, required: [true, 'Number of travelers is required'], min: [1, 'At least 1 traveler required'] },
  message:           { type: String, default: '' },
  status:            { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
