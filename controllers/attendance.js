const express = require('express')
const router = express.Router()

const Attendance = require('../models/Attendance')
const Event = require('../models/Event')
const verifyToken = require('../middleware/verify-token')

router.post('/:id/attend', verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ err: 'Event not found' })
    }

    const attending = await Attendance.findOne({ event: event._id, user: req.user._id })
    if (!attending) {
      await Attendance.create({ event: event._id, user: req.user._id, status: 'going' })
    }

    const attendanceData = await Attendance.find({ event: event._id }).populate('user', 'username')

    const attendees = []
    for (let i = 0; i < attendanceData.length; i++) {
      attendees.push(attendanceData[i].user)
    }

    res.status(200).json({ attendees: attendees, count: attendees.length })
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

router.delete('/:id/attend', verifyToken, async (req, res) => {
  try {
    await Attendance.findOneAndDelete({ event: req.params.id, user: req.user._id })

    const rows = await Attendance.find({ event: req.params.id }).populate('user', 'username')

    const attendees = []
    for (let i = 0; i < rows.length; i++) {
      attendees.push(rows[i].user)
    }

    res.status(200).json({ attendees: attendees, count: attendees.length })
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

router.get('/:id/attendees', verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('owner', '_id')
    if (!event) {
      return res.status(404).json({ err: 'Event not found' })
    }

    if (!event.owner || event.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ err: 'Not allowed' })
    }

    const rows = await Attendance.find({ event: event._id }).populate('user', 'username')

    const attendees = []
    for (let i = 0; i < rows.length; i++) {
      attendees.push(rows[i].user)
    }

    res.status(200).json({ attendees: attendees, count: attendees.length })
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

router.get('/:id/attending', verifyToken, async (req, res) => {
  try {
    const exists = await Attendance.findOne({ event: req.params.id, user: req.user._id })

    let attending = false
    if (exists) {
      attending = true
    }

    res.status(200).json({ attending: attending })
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

module.exports = router
