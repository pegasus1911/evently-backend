const express = require('express');
const router = express.Router();

const Attendance = require('../models/Attendance');
const Event = require('../models/Event');
const verifyToken = require('../middleware/verify-token');

async function getEvent(eventId, res) {
    const event = await Event.findById(eventId);
    if (!event) {
        res.status(404).json({ err: 'Event not found.' });
        return null;
    }
    return event;
}

router.post('/events/:id/attend', verifyToken, async (req, res) => {//verify token middleware checks if the user is logged in
    // this route is used to join an event
    try {
        const event = await getEvent(req.params.id, res);//getevent checks if the event exists
        if (!event) return;

        const databaseData = await Attendance.create({
            event: event._id,
            user: req.user._id,
            status: 'Joined'
        });

        res.status(201).json({
            _id: databaseData._id,
            event: databaseData.event,
            user: databaseData.user,
            status: databaseData.status
        });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

// This route is used to leave an event
router.delete('/events/:id/attend', verifyToken, async (req, res) => {
    try {
        await Attendance.findOneAndDelete({ event: req.params.id, user: req.user._id });
        res.json({ message: 'Left event successfully' });
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});
// This route is used to get all attendees of an event
router.get('/events/:id/attendees', verifyToken, async (req, res) => {
    try {
        const attendees = await Attendance.find({ event: req.params.id });
        res.json(attendees);
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

module.exports = router;
