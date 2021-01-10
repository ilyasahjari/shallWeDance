const express = require('express')
const router = express.Router()
const upload = require('../middleware/upload') 
const auth = require('../middleware/auth')
const Event = require('../models/Events')
const path = require('path')



router.get("/allEvents", async(req,res) =>{
    try{
        const allEvents = await Event.find({})
        res.status(200).send(allEvents)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get("/allCreatedEvents", auth, async(req, res)=>{
    try{
        await req.user.populate('createdEvents').execPopulate();
        res.send(req.user.createdEvents)
    }catch(e){
        res.status(400).send(e)
    }
})


router.get("/createdEvent/:id",auth, async(req,res) => {
    const _id = req.params.id  
    try{
        const event = await Event.findOne({_id, owner : req.user._id})
        res.status(200).send(event)
    }catch(e){
        res.status(500).send(e)
    }
})



router.post("/addEvent", auth, upload.single('image'), async(req,res) => {
    const event = new Event({
        ...req.body, 
        owner: req.user._id
    })

    if(req.file){
        var name = req.file.path
        var split = name.split(path.sep)
        event.image = split[split.length-1]
    }
    try{
        await event.save()
        res.status(200).send(event)
    }catch(e){
        res.status(400).send(e)
    }
})


router.patch("/update/:id", auth, async(req,res) => {
    const _id = req.params.id
    const eventUpdate = new Event(req.body)
    try{
        const event = await Event.findOneAndUpdate({_id, owner: req.user._id}, {$set : eventUpdate});
        res.status(200).send(event)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete("/delete/:id", auth, async(req,res) => {
    try{
        const event = await Event.findOneAndDelete({ _id: req.params.id, owner : req.user._id})
        res.status(200).send(event)
    }catch(e){
        res.status(400).send(e);
    }
    
})

module.exports = router