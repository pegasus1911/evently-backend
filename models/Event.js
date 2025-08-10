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
  location: {
      type: String,
      required: true,
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