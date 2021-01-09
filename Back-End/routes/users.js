const express = require('express')
const User= require('../models/Users');
const auth = require('../middleware/auth')
const router = new express.Router()


//add user with automatic connection by token
router.post('/addUser', async(req,res)=>{
    const user= new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.send({ user, token })
    }catch(e){
        res.status(400).send(e)
    }
    //la meme chose que 
    // user.save().then(()=>{
    //     res.send(user)
    // }).catch((error)=>{
    //     res.status(400).send(error)
    // })
})

//show my profile 
router.get('/user/me', auth, async(req, res)=>{
    res.send( req.user );
})

//show all users test
router.get('/allUsers',async (req,res)=>{
     try{
        const users = await User.find({})
        res.status(201).send(users)
     }catch(e){
        res.status(500).send(e)
     }
})


//show by id
router.get('/users/:id', auth, async(req,res)=>{
    const _id = req.params.id;
    try{
        const user = await User.findById(_id);
        if(!user)
            return res.status(400)
        res.status(201).send(user)
    }catch(e){
        res.status(500).send(e)
    }
})


//update user
router.patch('/user/me', auth, async(req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password','email', 'password','bornDate','gendre','bio','country','image']

    const isValidUpdate = updates.every( (update)=> allowedUpdates.includes(update) )

    if(!isValidUpdate){
        return res.status(404).send({error:'Invalide Update'})
    }
    try{   
        updates.forEach((update)=> req.user[update]= req.body[update])
        await req.user.save();
        // const user = await User.findByIdAndUpdate(_id, req.body,{ new: true , runValidators: true })
        res.status(201).send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})


//delete user
router.delete('/user/me', auth ,async(req,res)=>{
    try{
        await req.user.remove();
        res.status(200).send(user)
    }catch(e){
        res.status(400).send(e)
    }

})

//login/connect with email and password
router.post('/user/login', async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.send({user, token})
    }catch(e){ 
        res.status(400).send(e)
    }
})

//disconnect user
router.post('/user/logout', auth, async(req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
          return req.token !== token.token   
        })
        const user = await req.user.save();
        res.send(user) 
    }catch(e){
        res.status(500).send(e)
    }
})


//disconnect all users
router.post('/user/logoutall',auth, async(req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save();
        res.send() 
    }catch(e){
        res.status(500).send(e)
    }
})


module.exports = router