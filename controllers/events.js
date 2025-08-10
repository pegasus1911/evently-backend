const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const verifyToken = require('../middleware/verify-token');

router.get('/', async (req,res) => {
  try{
    const events = await Event.find()
    .populate('owner')
    .sort({createdAt: "desc"});

    res.status(201).json(events);

  } catch(error){
    res.status(500).json(error.message);
  }
})

router.use(verifyToken);

// Create an event
router.post('/', async (req,res) => {
  try{
    req.body.owner = req.user._id;
    const event = await Event.create(req.body);
    event._doc.owner = req.user;
    res.status(201).json(event);

  } catch(error){
    res.status(500).json(error.message);
  }
});

// edit an event
router.put('/:eventId', async (req,res) => {
  try{
    const event = await Event.findByIdAndUpdate(req.params.eventId, req.body, {new: true});

    if (!event.owner.equals(req.user._id)) {
			return res.status(403).send("You're not allowed to do that!");
		};
    
    event._doc.owner = req.user;
    res.status(201).json(event);

  } catch(error){
    res.status(500).json(error.message)
  }
});


// delete event
router.delete('/:eventId', async (req,res) => {
  try{
    
    const event = await Event.findById(req.params.eventId);

    if(!event.owner.equals(req.user._id)){
      return res.status(403).send("You're not allowed to do that!");
    };

    const deletedEvent = await Event.findByIdAndDelete(req.params.eventId);

    res.status(200).json(deletedEvent)

  } catch(error){
    res.status(500).json(error.message);
  }
})



module.exports = router;