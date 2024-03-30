const mongoose = require('mongoose');

const LandfillSchema = new mongoose.Schema({
  locationId:{
    type: String,
    required: true
  },
  landfillId: {
    type: Number,
    required: true,
    unique: true
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model('Landfill', LandfillSchema);
