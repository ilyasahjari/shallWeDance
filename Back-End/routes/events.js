const express = require('express')
const EventsController = require('../controllers/EventsController')
const router = express.Router()
const EventController = require('../controllers/EventsController')
const upload = require('../middleware/upload') 

router.get("/allEvents",EventsController.allEvents)
router.post("/oneEvent",EventController.getOneEvent)
router.post("/addEvent",upload.single('image'),EventsController.addEvent)
router.post("/updateEvent",upload.single('image'),EventsController.updateEvent)

module.exports = router