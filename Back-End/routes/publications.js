const express = require('express')
const Publication = require('../models/Publications')
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
        await req.user.populate('publications').execPopulate();
        res.send(req.user.publications)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router
