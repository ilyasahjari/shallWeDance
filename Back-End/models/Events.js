const { timeStamp } = require('console')
const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema(
    {
        name: {
            type : String,
            required: true
        },
        place: {
            type : String,
            default : "cite scientifique",
            required: true
        },
        city: {
            type : String,
            default : "lille"
        },
        postcode :{
            type : Number,
            default: 59650
        },
        description: {
            type : String,
            default: "evenement de danse"
        },
        date: {
            type : Date,
            required: true,
            default: Date.now
        },
        image : {
            type : String
        },
        hour : {
            type : String,
            default: "20:00"
        },
        owner :{
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref: "User"
        },
    }, {timestamps : true}
)

const Event = mongoose.model('Event',eventSchema)
module.exports= Event