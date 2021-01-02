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
            required: true
        },
        city: {
            type : String
        },
        postcode :{
            type : Number
        },
        description: {
            type : String,
            required: true
        },
        date: {
            type : Date,
            required: true
        },
        image : {
            type : String
        },
    }, {timestamps : true}
)

const Event = mongoose.model('Event',eventSchema)
module.exports= Event