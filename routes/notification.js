const express = require('express')

const router = express.Router()
const auth = require('../middleware/auth')
const Notification = require ('../models/Notification')

router.get('/allNotifsUser/:id',auth, async (req,res)=>{
    const _id = req.params.id
    try{
        const notifications = await Notification.find({receiver : _id}).sort([['createdAt', -1]])
        const count = await Notification.countDocuments({receiver : _id,statut: "nonlu"})
        res.status(200).send({notifications : notifications, count : count})
    }catch(e){
        res.status(400).send(e)
    }
})


router.get('/changeStatutNotif/:id',auth, async (req,res)=>{
    const _id = req.params.id
    try{
        const notif = await Notification.findOneAndUpdate({_id},{$set:{statut:"lu"}})
        res.status(200).send(notif)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/addNotification',auth,async (req,res)=> {
    const length = req.body.receiver.length
    const notifications = [] 
    for(let i=0;i<length;i++){
        const notification = new Notification({
            ...req.body,
            sender: req.user._id,
            receiver : req.body.receiver[i]
        })
        try{
            await notification.save()
            notifications.push(notification)
        }catch (e) {
            res.status(400).send(e)
        }
    }
    res.status(200).send(notifications)
    
})

router.get('/setAllNotifsToRead/:id',auth,async (req,res) => {
    const _id = req.params.id
    try{
        const update = await Notification.updateMany({receiver:_id},{$set:{statut:"lu"}})
        const notifications = await Notification.find({receiver : _id}).sort([['createdAt', -1]])
        res.status(200).send({notifications : notifications, count : 0})
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/deleteNotif/:id',auth,async (req,res)=> {
    const _id = req.params.id
    try{
        const notification = await Notification.findOneAndDelete({_id})
        res.status(200).send(notification)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/deleteAllNotif/:id',auth,async (req,res)=> {
    const _id = req.params.id
    try{
        const deleteNotif = await Notification.deleteMany({receiver : _id})
        res.status(200).send(deleteNotif)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router


