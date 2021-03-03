const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const publicationSchema = new Schema( 
    {

        content: {
            type : String,
            default: "publication",
            require:true
        },
        image : {
            type : String
        },
        video : {
            type : String
        },
        owner :{
            type : mongoose.Schema.Types.ObjectId,
            required : true,
            ref: "User"
        },
        event : {
            type : mongoose.Schema.Types.ObjectId,
            ref: "Event"
        },
        likes : [{
            type : mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }]
    }, {timestamps : true}
)



const Publication = mongoose.model('Publication', publicationSchema)

module.exports = Publication
