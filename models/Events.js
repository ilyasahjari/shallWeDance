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
            type : Number,
            default: 59650
        },
        description: {
            type : String
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
            type : String
        },
        owner :{
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref: "User"
        },
        participants : [{
            type : mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        iscancel : {
            type : Boolean,
            default : false
        },
        cancelreason : {
            type : String
        },
        type : {
            type : mongoose.Schema.Types.ObjectId,
            ref: "DanseType"
        }
    }, {timestamps : true}
)

eventSchema.virtual('publicationsEvent',{
    ref:'Publications',
    localField: '_id',
    foreignField: 'event'
})

eventSchema.virtual('eventbyType',{
    ref:'DanseType',
    localField: '_id',
    foreignField: 'events'
})

const Event = mongoose.model('Event',eventSchema)
module.exports= Event
