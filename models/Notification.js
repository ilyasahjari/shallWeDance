const { timeStamp } = require('console')
const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const notificationschema = new Schema(
    {
        title: {
            type : String,
            required: true
        },
        lien: {
            type : String,
        },
        statut: {
            type : String,
            required: true
        },
        sender :{
            type : mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        receiver :{
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref: "User"
        },
    }, {timestamps : true}
)

const Notification = mongoose.model('Notification',notificationschema)
module.exports= Notification