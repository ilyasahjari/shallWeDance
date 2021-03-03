const express = require('express')

const router = express.Router()
const auth = require('../middleware/auth')
const Comment = require('../models/Comments')
const Publication = require('../models/Publications')
const Event = require('../models/Events')

router.get('/allComments/:idPub',auth, async (req,res)=>{
    try{
        const allComments = await Comment.find({post : req.params.idPub}).populate('owner')
        res.status(200).send(allComments)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/addComment/:idPub', auth, async (req, res)=>{
    const _id = req.params.idPub;
    const newComment = new Comment({
        ...req.body,
        owner: req.user._id,
        post: _id
    })
    
    const publication = await Publication.findById(_id)
    publication.comments.push(newComment);
    publication.save()
    const result = await newComment.save();
    res.send(result) 
         
})

router.post('/addComment/:idEvent', auth, async (req, res)=>{
    const _id = req.params.idEvent;
    const newComment = new Comment({
        ...req.body,
        owner: req.user._id,
        post: _id
    })
    
    const event = await Event.findById(_id)
    event.comments.push(newComment);
    event.save()
    const result = await newComment.save();
    
    res.send(result) 
         
})

router.post("/updateComment/:id", auth, async (req,res)=>{
    const _id = req.params.id

    const commentUpdate = new Comment({
        ...req.body,
        owner: req.user._id
    }) 

    try{
        const comment = await Comment.findByIdAndUpdate({_id, owner: req.user._id}, {$set: commentUpdate})
        res.status(200).send(comment)
    }catch(e){
        res.status(400).send(e)
    }

}) 



router.post('/deleteComment/:idComment', auth, async (req,res)=>{
    const _id = req.params.idComment
    
    try{
        const comment = await Comment.findOneAndDelete({_id, owner: req.user._id});
        res.status(200).send(comment)        
    }catch(e){
        res.status(400).send(e);
    }
})

module.exports = router