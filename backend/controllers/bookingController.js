const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  try {
    const { name, email, phone, monastery, travelDate, numberOfTravelers, message } = req.body;
    if (!name || !email || !phone || !monastery || !travelDate || !numberOfTravelers) {
      return res.status(400).json({ success: false, error: 'Please fill in all required fields' });
    }
    const booking = await Booking.create({ name, email, phone, monastery, travelDate, numberOfTravelers, message });
    await booking.populate('monastery', 'name location');
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('monastery', 'name location').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('monastery', 'name location');
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, error: 'Booking not found' });
    res.status(200).json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { createBooking, getBookings, getBooking, deleteBooking };
