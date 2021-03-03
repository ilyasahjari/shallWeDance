const express = require('express')

const router = express.Router()
const upload = require('../middleware/upload')
const auth = require('../middleware/auth')
const Groupe = require('../models/Groupes')
const path = require('path')



router.get("/allGroupes", auth, async (req, res) => {
    try {
        await req.user.populate('myGroupes').execPopulate();
        res.status(200).send(req.user.myGroupes)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post("/addGroupe", auth, upload.single('image'), async (req, res) => {
    const groupe = new Groupe({
        ...req.body,
        owner: req.user._id
    })

    groupe.membres.push(groupe.owner);


    if (req.file) {
        var name = req.file.path
        var split = name.split(path.sep)
        groupe.image = split[split.length - 1]
    }
    try {
        await groupe.save()
        res.status(200).send(groupe)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/getGroupe/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const groupe = await Groupe.findOne({ _id, owner: req.user._id})
        res.send(groupe)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/getGroupe/withMembres/:id', auth, async (req, res) => {

    const _id = req.params.id;
    try {
        const groupe = await Groupe.findOne({ _id, owner: req.user._id})
        await groupe.execPopulate('membres');
        res.send(groupe)
    } catch (e) {
        res.status(400).send(e)
    }
})


router.post("/update", auth, upload.single('image'), async (req, res) => {
    const groupeUpdate = new Groupe({
        ...req.body,
        owner: req.user._id
    })

    const oldGroupe = await Groupe.findById(groupeUpdate._id);

    if (req.file) {
        var name = req.file.path
        var split = name.split(path.sep)
        groupeUpdate.image = split[split.length - 1]
        if(oldGroupe.image) {
            fs.unlinkSync(process.cwd()+"/client/public/images/"+oldGroupe.image)
        }
    }
    try {
        const groupe = await Groupe.findOneAndUpdate({ _id: groupeUpdate._id, owner: req.user._id }, { $set: groupeUpdate });
        res.status(200).send(groupe)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post("/leave", auth, async (req, res) => {
    const groupeUpdate = new Groupe({
        ...req.body
    })

    groupeUpdate.membres.splice(groupeUpdate.membres.indexOf(req.user), 1);


    try {
        await Groupe.findOneAndUpdate({ _id: groupeUpdate._id, owner: req.user._id }, { $set: groupeUpdate });
        await req.user.populate('myGroupes').execPopulate();
        res.status(200).send(req.user.myGroupes)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete("/delete/:id", auth, async (req, res) => {

    const id = req.params.id;

    try {
        // Envoyer une notification aux membres du groupe
        await Groupe.findOneAndDelete({ _id: id, owner: req.user._id });
        await req.user.populate('myGroupes').execPopulate();
        res.status(200).send(req.user.myGroupes)
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router
