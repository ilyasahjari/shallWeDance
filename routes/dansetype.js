const express = require('express')

const router = express.Router()
const auth = require('../middleware/auth')
const DanseType = require ('../models/DanseType')


router.get('/allTypes', async (req,res)=>{
    try{
        const types = await DanseType.find({ })
        res.status(200).send(types)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/addType',auth, async (req,res)=>{
    const newType = new DanseType({
        ...req.body,
    })
    const result = await newType.save();
    res.send(result) 
})

module.exports = router