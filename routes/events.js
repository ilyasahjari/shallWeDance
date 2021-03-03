const express = require('express')

const router = express.Router()
const upload = require('../middleware/upload')
const auth = require('../middleware/auth')
const Event = require('../models/Events')
const path = require('path')
const { findOne } = require('../models/Events')
const User = require('../models/Users')
const fs = require('fs');
const mongoose = require('mongoose')
const DanseType = require ('../models/DanseType')


router.get("/allEvents", async (req, res) => {
    const pagination = req.body.pagination ? parseInt(req.body.pagination) : 2;
    const pageNumber = req.body.page ? parseInt(req.body.page) : 1;
    const today = Date.now()
    try {
        var query = {iscancel:false,date : { $gt : today} }
        const allEvents = await Event.find(query).skip((pageNumber - 1) * pagination).limit(pagination)
        const count = await Event.countDocuments(query)
        res.status(200).send({events : allEvents, count : count})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/countEventsUser/:id",auth,async (req,res) => {
    const id = req.params.id
    try{
        const count = await Event.countDocuments({owner:id})
        res.status(200).send({count:count})
    }catch (e) {
        res.status(400).send(e)
    }
}
)


router.get("/allEventSearch/:search?/:type?/:page?/:numberPerPage?",auth,async(req,res) => {
    var search = req.params.search
    var pagination = req.params.numberPerPage ? parseInt(req.params.numberPerPage) : 2
    var pageNumber = req.params.page ? parseInt(req.params.page) : 1
    var type = req.params.type ? req.params.type : "all"
    var typequery =""
    const today = Date.now()
    if(!search)
        search = " "
    const regex = new RegExp(search,"i")
    if(type==="all")
        typequery  =  {$exists: true}
    else
        typequery = type
    try{
        var query= { iscancel:false ,type: typequery,date : { $gt : today}, $or : [ {name : {$regex : regex} } , {description : {$regex : regex} }, {place : {$regex : regex} } ] }
        const events = await Event.find(query).skip((pageNumber - 1) * pagination).limit(pagination)
        const count = await Event.countDocuments(query)
        res.status(200).send({events : events , count : count})
    }catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})


router.get("/allCreatedEvents/:page?/:numberPerPage?", auth, async (req, res) => {
    var pagination = req.params.numberPerPage ? parseInt(req.params.numberPerPage) : 2;
    var pageNumber = req.params.page ? parseInt(req.params.page) : 1;
    try {
        var opt = { skip : (pageNumber-1)*pagination , limit : pagination }
        await req.user.populate({path:'createdEvents',options:opt}).execPopulate();
        var eventsLimit = req.user.createdEvents
        await req.user.populate('createdEvents').execPopulate()
        res.send({events : eventsLimit,count : req.user.createdEvents.length})
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get("/createdEvent/:id", auth, async (req, res) => {
    const _id = req.params.id
    try {
        const event = await Event.findOne({ _id, owner: req.user._id })
        res.status(200).send(event)
    } catch (e) {
        res.status(500).send(e)
    }
})


router.get("/searchCreatedevent/:search?/:choice?/:type?/:page?/:numberPerPage?",auth,async(req,res) => {
    var search = req.params.search ? req.params.search : " "
    var choice = req.params.choice ? req.params.choice : "all"
    var pagination = req.params.numberPerPage ? parseInt(req.params.numberPerPage) : 2;
    var pageNumber = req.params.page ? parseInt(req.params.page) : 1;
    var type = req.params.type ? req.params.type : "all"
    const regex = new RegExp(search,"i")
    var typequery =""
    if(type==="all")
        typequery  =  {$exists: true}
    else
        typequery = type
    try{
        if(choice==="all"){
            var query = { owner: req.user._id, type : typequery,$or : [ {name : {$regex : regex} } , {description : {$regex : regex} }, {place : {$regex : regex} } ] }
        }
        if(choice==="passe"){
            var today = Date.now()
            var query = {  owner: req.user._id, type : typequery, date : { $lt : today}, $or : [ {name : {$regex : regex} } , {description : {$regex : regex} }, {place : {$regex : regex} } ] }
        }
        else{
            var query = { owner: req.user._id , type : typequery, iscancel:choice==="annule", $or : [ {name : {$regex : regex} } , {description : {$regex : regex} }, {place : {$regex : regex} } ] }
        }
        const events = await Event.find(query).skip((pageNumber - 1) * pagination).limit(pagination)
        const count = await Event.countDocuments(query)
        res.status(200).send({events : events,count : count})
    }catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})


router.post("/addEvent", auth, upload.single('image'), async (req, res) => {
    const event = new Event({
        ...req.body,
        owner: req.user._id
    })

    if (req.file) {
        var name = req.file.path
        var split = name.split(path.sep)
        event.image = split[split.length - 1]
    }
    try {
        await event.save()
        const _id = event.type
        const type = await DanseType.findOneAndUpdate({_id},{$push:{events:event}})
        res.status(200).send(event)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/getEvent/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const event = await Event.findOne({ _id })
        res.send(event)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/getEventDetails/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const event = await Event.findOne({ _id }).populate("type").populate("owner")
        res.send(event)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post("/cancel", auth, upload.single('image'), async (req, res) => {
    
    const id = req.body._id
    const reason = req.body.cancelreason
    try{
        const event = await Event.findOneAndUpdate({ _id: id, owner: req.user._id },{iscancel:true,cancelreason:reason})
        res.status(200).send(event)
    }
    catch (e) {
        res.status(400).send(e)
    }

})

router.post("/update", auth, upload.single('image'), async (req, res) => {
    const eventUpdate = new Event({
        ...req.body,
        owner: req.user._id
    })
    const oldEvent = await Event.findById(eventUpdate._id);

    if (req.file) {
        var name = req.file.path
        var split = name.split(path.sep)
        eventUpdate.image = split[split.length - 1]
        if(oldEvent.image) {
            fs.unlinkSync(process.cwd()+"/../Front-End/public/images/"+oldEvent.image)
        }
    }
    try {
        const event = await Event.findOneAndUpdate({ _id: eventUpdate._id, owner: req.user._id }, { $set: eventUpdate });
        res.status(200).send(event)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete("/delete/:id", auth, async (req, res) => {
    const _id = req.params.id
    console.log(_id)
    try {
        const event = await Event.findOneAndDelete({ _id, owner: req.user._id })
        res.status(200).send(event)
    } catch (e) {
        res.status(400).send(e);
    }
})

router.post("/participate/:id", auth, async (req, res) => {
    const _id = req.params.id
    try {
        const findEvent = await Event.findOne({ _id, participants: req.user._id })
        if (!findEvent) {
            const event = await Event.findOneAndUpdate({ _id }, { "$push": { "participants": req.user._id } })
            res.status(200).send(event)
        }else
        res.status(400).send({
            message: "you already participate"
        })

    } catch (e) {
        res.status(400).send(e);
    }
})


router.post("/unparticipate/:id", auth, async (req, res) => {
    const _id = req.params.id
    try {
        const findEvent = await Event.findOne({ _id, participants: req.user._id })
        if (findEvent) {
            const event = await Event.findOneAndUpdate({ _id }, { "$push": { "participants": req.user._id } })
            res.status(200).send(event)
        }else
        res.status(400).send({
            message: "you're not participating"
        })

    } catch (e) {
        res.status(400).send(e);
    }
})

router.get("/participateEvent",auth, async (req, res) => {
    const idUser = req.user._id
    try{
        var query = {participants:idUser}
        const events = await Event.find({participants:req.user._id})
        const count = await Event.countDocuments(query)
        res.status(200).send({events : events,count:count})
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router
