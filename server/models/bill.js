const mongoose = require('mongoose');

const BillsSchema = new mongoose.Schema({
  billId: {
    type: Number,
    required: true
  },
  registrationNumber: {
    type: String,
    required: true
  },
  wardNumber: {
    type: Number,
    required: true
  },
  // Changed to Date type for timestamps
  arrivalTime: {
    type: Date,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  distance: {
    type: Number,
    required: true
  },
  time: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  costPerKm: {
    type: Number,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  // Added stsLocationId and landfillLocationId fields
  stsLocationId: {
    type: String,
    required: true
  },
  landfillLocationId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Bills', BillsSchema);
