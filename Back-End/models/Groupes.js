const { timeStamp } = require('console')
const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema(
    {
        name: {
            type : String,
            required: true
        },
        description: {
            type : String,
            default: "groupe de danse"
        },
        image : {
            type : String
        },
        owner :{
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref: "User"
        },
        membres : [{
            type : mongoose.Schema.Types.ObjectId,
            ref: "User"
        }]
    }, {timestamps : true}
)

const Event = mongoose.model('Groupe',eventSchema)
module.exports= Groupe
