const express = require('express');// framework for bldg APIs
const router = express.Router();// lets u grp routes
const Event = require('../models/Event');// model for events
const verifyToken = require('../middleware/verify-token');// middleware to verify JWT



router.get('/', async (req,res) => {
  try{
    const events = await Event.find()
    .populate('owner')
    .sort({createdAt: -1});

    res.status(200).json(events);

  } catch(error){
    res.status(500).json(error.message);
  }
});

router.get('/:eventId', async (req,res) => {
  // this route is used to get a specific event
  try{
    //event.findbyid finds the event in mongodb
    const event = await Event.findById(req.params.eventId).populate('owner');// req.params.eventId is the id of the event that is passed in the url
    // await is used to wait for the data to be fetched from the database
    res.status(200).json(event);
// this sends the event back to the frontend
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
    res.status(200).json(event);

  } catch(error){
    res.status(500).json(error.message);
  }
});

// edit an event
router.put('/:eventId', async (req,res) => {
  try{
    const event = await Event.findByIdAndUpdate(req.params.eventId, req.body, {new: true});

    if (!event.owner.equals(req.user._id)) 
      {
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

//201 for created
// 200 for success
// 403 for forbidden (user not allowed to perform action)
// 400 for bad request (e.g., missing parameters)
// 401 for unauthorized (e.g., user not logged in)
// 404 for not found
// 500 for server error
module.exports = router;