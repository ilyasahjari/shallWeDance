const express = require('express')
const Publication = require('../models/Publications')
const User = require('../models/Users')
const auth = require('../middleware/auth')
const router = new express.Router()
const upload = require('../middleware/upload')
const path = require('path')


router.post("/addPublication", auth, upload.single('image'), async (req, res) => {
    const publication = new Publication({
        ...req.body,
        owner: req.user._id
    })
    if (req.file) {
        var name = req.file.path
        var split = name.split(path.sep)
        publication.image = split[split.length - 1]
    }
    try {
        await publication.save()
        res.status(200).send(publication)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/myPublications", auth, async (req, res) => {
    try {
        // await req.user.populate({ path : 'publications', match : { event:null} ,options: { sort: { 'createdAt': -1 } }} ).execPopulate();
        // const publications = await req.user.publications.populate('comments')


        const posts = await Publication.find({ owner: req.user._id, event: null })
            .sort([['createdAt', -1]]).populate('owner')
            .populate({ path: 'comments', populate: { path: 'owner' }, option: { sort: { "createdAt": -1 } } });

        res.send(posts)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get("/userPublications/:id", auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const posts = await Publication.find({ owner: _id, event: null })
            .sort([['createdAt', -1]]).populate('owner')
            .populate({ path: 'comments', populate: { path: 'owner' }, option: { sort: { "createdAt": -1 } } });

        res.send(posts)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.get("/allPublications", auth, async (req, res) => {
    try {
        const allPublications = await Publication.find({}).sort([['createdAt', -1]]).populate('owner');

        //grand effort dez
        // for(var i=0;i<allPublications.length;i++){
        //     var id = allPublications[i].owner
        //     const user = await User.findById(id)
        //     if(user)
        //         allPublications[i].owner = user
        // }
        res.send(allPublications);
    } catch (e) {
        res.status(400).send(e)
    }
})



router.post("/addLike/:id", auth, async (req, res) => {
    const _id = req.params.id
    try {
        const findPubli = await Publication.findOne({_id, likes: req.user._id})
        if (!findPubli) {
            const publi = await Publication.findOneAndUpdate({ _id }, { "$push": { "likes": req.user._id } })
            res.status(200).send(publi)
        } else
            res.status(400).send({
                message: "you already like this publication"
            })

    } catch (e) {
        res.status(400).send(e);
    }
})


router.post("/removeLike/:id", auth, async (req, res) => {
    const _id = req.params.id
    try {
        const findPubli = await Publication.findOne({_id, likes: req.user._id})
        if (findPubli) {
            const publi = await Publication.findOneAndUpdate({ _id }, { "$pull": { "likes": req.user._id } })
            res.status(200).send(publi)
        } else
            res.status(400).send({
                message: "you already unlike this publication"
            })

    } catch (e) {
        res.status(400).send(e);
    }
})

router.get('/getEventPublications/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const publications = await Publication.find({ event: _id }).sort({ createdAt: -1 }).populate('owner').populate({ path: 'comments', populate: { path: 'owner' }, option: { sort: { "createdAt": -1 } } });
        res.send(publications)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/getEventPublicationsParticipate', auth, async (req, res) => {
    const _id = req.user._id
    try {
        const publications = await Publication.find().populate({ path: 'event', match: { participants: { $in: _id } }}).sort({createdAt: -1}).populate('owner').populate({ path: 'comments', populate: { path: 'owner' }, option: { sort: { "createdAt": -1 } } });
        res.send(publications)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/getUsersPublicationsFollowing', auth, async (req, res)=>{
    try{
        const following = req.user.following;
        const publications = await Publication.find().populate("event").populate({path :'owner', match:{_id :{$in : following}}}).sort({createdAt: -1}).populate({ path: 'comments', populate: { path: 'owner' }, option: { sort: { "createdAt": -1 } } });
        res.send(publications)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/feed', auth, async(req, res)=>{
    const _id = req.user._id
    try{
        const following = req.user.following;
        const publicationsUsers = await Publication.find().populate("event").populate({path :'owner', match:{_id :{$in : following}}}).sort({createdAt: -1}).populate({ path: 'comments', populate: { path: 'owner' }, option: { sort: { "createdAt": -1 } } });
        const publicationsEvents = await Publication.find().populate({ path: 'event', match: { participants: { $in: _id } }}).sort({createdAt: -1}).populate('owner').populate({ path: 'comments', populate: { path: 'owner' }, option: { sort: { "createdAt": -1 } } });
        let feedUsers = publicationsUsers.filter((userPost)=> userPost.owner !== null && userPost.event == null)
        let feedEvents = publicationsEvents.filter((eventPost)=> eventPost.event)
        const feed = [...feedUsers,...feedEvents].sort((a,b)=> b.createdAt - a.createdAt)
        res.send(feed);
    }catch(e){
        res.status(400).send(e)
    }
})



module.exports = router
