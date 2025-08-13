const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const verifyToken = require('../middleware/verify-token');
const attendance = require('./attendance');
const upload = require('../config/multer');


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
  try{
    const event = await Event.findById(req.params.eventId).populate('owner');
    res.status(200).json(event);
  } catch(error){
    res.status(500).json(error.message);
  }
})



router.use(verifyToken);

// Create an event
router.post('/', upload.single('image'), async (req,res) => {
  console.log(req.file)
  console.log(req.body)
  try{
    req.body.owner = req.user._id; 

    req.body.image = {
      url:req.file.path,
      cloudinary_id: req.file.fieldname
    }

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
// 400 for bad request 
// 401 for unauthorized 
// 404 for not found
// 500 for server error
module.exports = router;