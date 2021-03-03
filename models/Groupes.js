const { timeStamp } = require('console')
const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const groupeSchema = new Schema(
    {
        name: {
            type : String,
            required: true
        },
        description: {
            type : String
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

const Groupe = mongoose.model('Groupe',groupeSchema)
module.exports= Groupe
