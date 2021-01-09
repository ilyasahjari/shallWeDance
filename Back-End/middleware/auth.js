const jwt = require('jsonwebtoken')
const User = require('../models/Users')


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'testnodeapp')
        const user = await User.findOne( { _id: decoded._id , "tokens.token": token } )

        if(!user)
            throw new Error('Please connect !')
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({error : 'please connect !'})
    }
}

module.exports = auth