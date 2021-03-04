const express = require('express')

const router = express.Router()
const auth = require('../middleware/auth')
const Rate = require('../models/Rate')
//const Event = require('../models/Event')


router.get('/allRates/:idEvent', auth, async(req,res)=>{
    const _id = req.params.idEvent;
    try{
        const rates = await Rate.find({event: _id}).populate('owner').sort({createdAt: -1})
        res.send(rates)
    }catch(e){
        res.status(400).send(e)
    }
})


router.post('/addRate/:idEvent',auth, async(req,res)=>{
    const _id = req.params.idEvent
    const rate = new Rate({
        ...req.body,
        owner: req.user._id,
        event: _id
    })
    
    try{
        const newRate = await rate.save();
        res.send(newRate)
    }catch(e){
        res.status(400).send(e)
    }

})

router.post('/deleteRate/:idRate', auth, async (req,res)=>{
    const _id = req.params.idRate
    
    try{
        const rate = await Rate.findOneAndDelete({_id, owner: req.user._id});
        res.status(200).send(rate)        
    }catch(e){
        res.status(400).send(e);
    }
})

module.exports = router