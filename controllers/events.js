const express = require('express');// framework for bldg APIs
const router = express.Router();// lets u grp routes
const Event = require('../models/Event');// model for events
const verifyToken = require('../middleware/verify-token');// middleware to verify JWT


// ============OLD CODE============ //
// this router will handle all requests related to events
// router.get('/', async (req,res) => {// router is mini express app for only one resource 
//   //get command will direct the request to a certain path
//   // async function to handle the request, await is used inside async 
//   try{
//     const events = await Event.find()
//     .populate('owner')
//     .sort({createdAt: "desc"});

//     res.status(201).json(events);

//   } catch(error){
//     res.status(500).json(error.message);
//   }
// });// working inside try is better and if there are any errors it will be caught in the catch block

// router.get('/:eventId', async (req,res) => {
//   // this route is used to get a specific event
//   try{
//     //event.findbyid finds the event in mongodb
//     const event = await Event.findById(req.params.eventId).populate('owner');// req.params.eventId is the id of the event that is passed in the url
//     // await is used to wait for the data to be fetched from the database
//     res.status(201).json(event);
// // this sends the event back to the frontend
//   } catch(error){
//     res.status(500).json(error.message);
//   }
// })

//=============NEW CODE ==========
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('owner')
      .sort({ createdAt: -1 }); 
    res.status(200).json(events); // Changed  201 cuz there was the err
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

router.get('/:eventId', async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId).populate('owner');
    if (!event) return res.status(404).json({ err: 'Event not found' });
    res.status(200).json(event); // was 201
  } catch (error) {
    res.status(500).json({ err: error.message });
  }
});

router.use(verifyToken);
// Create an event
router.post('/', async (req,res) => {
  try{
    req.body.owner = req.user._id; // this will prevent users from creating events without being logged in
    const event = await Event.create(req.body);// insert a new event into the db
    event._doc.owner = req.user;// add the owner to the event object
    res.status(201).json(event);

  } catch(error){
    res.status(500).json(error.message);
  }
});

// edit an event
router.put('/:eventId', async (req,res) => {
  try{
    const event = await Event.findByIdAndUpdate(req.params.eventId, req.body, {new: true});
//findByIdAndUpdate will find the event by id and update it with the new data
    if (!event.owner.equals(req.user._id)) // check if the user is the owner of the event
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
//findByIdAndDelete will find the event by id and delete it
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