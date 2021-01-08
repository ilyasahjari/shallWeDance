const Event = require('../models/Events')
const path = require('path')

const allEvents=(req,res) =>{
    Event.find()
    .then(response => {
        res.json({
            response
        })
    })
    .catch(error => {
        res.json({
            message : 'An error Occured during getting events!'
        })
    })
}

const getOneEvent=(req,res) => {
    let eventId = req.body.eventId
    Event.findById(eventId)
    .then(response => {
        res.json({
            response
        })
    })
}

const addEvent=(req,res) => {
    let event = new Event({
        name: req.body.name,
        place: req.body.place, 
        city: req.body.city,
        postcode: req.body.postcode,
        description: req.body.description,
        date: req.body.date,
        hour :req.body.hour
    })
    if(req.file){
        var name = req.file.path
        var split = name.split(path.sep)
        event.image = split[split.length-1]
    }
    event.save()
    .then(response => {
        res.json({
            message : 'Event Added'
        })
    })
    .catch(error => {
        res.json({
            message : 'An error Occured during adding event!'
        })
    })
}

const updateEvent=(req,res) => {
    let eventId = req.body.eventId
    let eventUpdate = new Event({
        _id : eventId,
        name: req.body.name,
        place: req.body.place, 
        city: req.body.city,
        postcode: req.body.postcode,
        description: req.body.description,
        date: req.body.date,
        hour :req.body.hour
    })

    Event.findByIdAndUpdate(eventId, {$set : eventUpdate})
    .then( () =>{
        res.json({
            message : 'Event Updated'
        })
    })
    .catch(error => {
        res.json({
            message : 'An error Occured during updated event!'
        })
    })

}

const deleteEvent=(req,res) => {
    let eventId = req.body.eventId
    Event.findByIdAndDelete(eventId)
    .then( () =>{
        res.json({
            message : 'Event Deleted'
        })
    })
    .catch(error => {
        res.json({
            message : 'An error Occured during delete event !'
        })
    })

}

module.exports = {
    allEvents,getOneEvent,addEvent,updateEvent,deleteEvent
}
