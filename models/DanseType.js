const { timeStamp } = require('console')
const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const dansetypeSchema = new Schema(
    {
        name: {
            type : String,
            required: true
        },
        events : [{
            type : mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }],
    }, {timestamps : true}
)



const DanseType = mongoose.model('DanseType',dansetypeSchema)
module.exports= DanseType