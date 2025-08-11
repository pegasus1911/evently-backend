const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // this means this is a relationship to another model
    ref: 'User',
    required: true,// this means the user is required
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
    status: {
  type: String,
  enum: ['going'],
  default: 'going',
  required: true,

    
  },
  respondedAt: {
    type: Date,
    default: Date.now,
  },
});

attendanceSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();// add a new field to string
    delete returnedObject._id;// remove the _id field
    delete returnedObject.__v; // remove the __v field
  },
});

module.exports = mongoose.model('Attendance', attendanceSchema);