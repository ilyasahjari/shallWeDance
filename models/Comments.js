const mongoose = require ('mongoose')
const Schema = mongoose.Schema


const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Publication"
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            required : true,
            ref: "User"
        }
    }, {timestamps: true}
)

commentSchema.virtual('publication',{
    ref:'Publication',
    localField: '_id',
    foreignField: 'comments'
})



const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment