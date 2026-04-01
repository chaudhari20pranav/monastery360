const express = require('express');
const router  = express.Router();
const { createBooking, getBookings, getBooking, deleteBooking } = require('../controllers/bookingController');

router.route('/').get(getBookings).post(createBooking);
router.route('/:id').get(getBooking).delete(deleteBooking);

module.exports = router;
