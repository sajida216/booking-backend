const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  hotelName: String,
  checkInDate: Date,
  checkOutDate: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Booking', bookingSchema);




