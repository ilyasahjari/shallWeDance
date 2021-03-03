const express = require('express')
const User = require('../models/Users');
const auth = require('../middleware/auth')
const router = new express.Router()
const upload = require('../middleware/upload')
const path = require('path')
const fs = require('fs');




//add user with automatic connection by token
router.post('/register', upload.single('image'), async (req, res) => {
    const user = new User(req.body)
    if (req.file) {
        var name = req.file.path
        var split = name.split(path.sep)
        user.image = split[split.length - 1]
    }
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//show my profile 
router.get('/me', auth, async (req, res) => {
    res.status(200).send(req.user);
})

//show all users test
router.get('/allUsers', auth, async (req, res) => {
    const _id = req.user._id
    try {
        const users = await User.find({_id : {$ne: _id}})
        res.status(201).send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})



//show by id
router.get('/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user)
            return res.status(400)
        res.status(201).send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})


//update user
router.post('/update/me', auth, upload.single('image'), async (req, res) => {
    const updateData = req.body;
    const oldUser = await User.findById(req.user._id)

    if (req.file) {
        var name = req.file.path
        var split = name.split(path.sep)
        updateData.image = split[split.length - 1]
        if (oldUser.image) {
            fs.unlinkSync(process.cwd() + "/../Front-End/public/images/" + oldUser.image)
        }
    }
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password', 'email', 'password', 'bornDate', 'gendre', 'bio', 'country', 'image']

    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    // if(!isValidUpdate){
    //     return res.status(404).send({error:'Invalide Update'})
    // }
    try {
        updates.forEach((update) => req.user[update] = updateData[update])
        await req.user.save();
        // const user = await User.findByIdAndUpdate(_id, req.body,{ new: true , runValidators: true })
        res.status(201).send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/follow/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const my_id = req.user._id
    try {
        const findUser = await User.findOne({ _id: my_id, following: _id })
        if (!findUser) {
            const user = await User.findOneAndUpdate({ _id: my_id }, { "$push": { "following": _id } })
            const followers = await User.find({ "following": { $in: _id} })
            res.status(200).send(followers)
        } else
            res.status(400).send({
                message: "you already follow"
            })
    } catch (e) {
        console.log(e)
    }

})

router.post('/unfollow/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const my_id = req.user._id
    try {
        const findUser = await User.findOne({ _id: my_id, following: _id })
        if (findUser) {
            const user = await User.findOneAndUpdate({ _id: my_id }, { "$pull": { "following": _id } })
            const followers = await User.find({ "following": { $in: _id} })
            res.status(200).send(followers)
        } else
            res.status(400).send({
                message: "you're not following to unfollow !?"
            })
    } catch (e) {
        console.log(e)
    }

})



router.get('/followers/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const followers = await User.find({ "following": { $in: _id} })
        if (followers)
            res.status(200).send(followers)
        else
            res.status(400).send({
                message: "no followers"
            })

    } catch (e) {
        console.log(e)
    }
})


//delete user
router.delete('/delete/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.status(200).send(user)
    } catch (e) {
        res.status(400).send(e)
    }

})

//login/connect with email and password
router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken();
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

//disconnect user
router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return req.token !== token.token
        })
        const user = await req.user.save();
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})


//disconnect all users
router.post('/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save();
        res.send()
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router