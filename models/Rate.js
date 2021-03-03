const mongoose = require ('mongoose')
const Schema = mongoose.Schema


const ratingSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        rate:{
            type: Number,
            required: true
        },
        event: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Event"
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required : true,
            ref: "User"
        },

    }, {timestamps: true}
)



const Rating = mongoose.model('Rating', ratingSchema)

module.exports = Rating