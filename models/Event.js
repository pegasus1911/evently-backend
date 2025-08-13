const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
      type: Date,
      required: true
    },
locationName: { //  readable address
    type: String,
    required: true
  },
  location: {     // lat/lng coordinates
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  isPublic: {
      type: Boolean,
      required: true,
    },
  capacity: {
      type: String,
      required: true
    },
  owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
  }

  
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
