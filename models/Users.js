const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        require:true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value))
                throw new Error('Not valid email !')
        }
    },
    password : {
        type: String,
        required: true
    },
    bornDate :{
        type: Date,
        default: Date.now
    },
    gendre :{
        type : String,
        default : "M"  
    },
    bio :{
        type : String,
        default: "Ready to dance"
    },
    country: {
        type: String,
        default : 'France'
    },
    image: {
        type: String,
        default: ''
    },
    style: {
        type : String,
        default: 'HipHop'
    },
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//create user token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'testnodeapp')

    user.tokens = user.tokens.concat({ token })
    await user.save();
    return token;
}

//not show the private data
userSchema.methods.toJSON = function (){
    const user = this 
    const userObject = user.toObject()

    //delete userObject.password;
    delete userObject.tokens;

    return userObject
}

//find by email and password
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch)
        throw new Error('Unable to login')

    return user;
}


//to crypt the user password while updating
userSchema.pre('save', async function (next) {
    const user = this;
    console.log('added user middelware !')

    if (user.isModified('password'))
        user.password = await bcrypt.hash(user.password, 8)

    next();
})

//add a virtual relation between event and creator 
userSchema.virtual('createdEvents',{
    ref: 'Event',
    localField:'_id',
    foreignField: 'owner'
})


//add a virtual relation between event and participant
userSchema.virtual('participateEvent',{
    ref:'Event',
    localField: '_id',
    foreignField: 'participants'
})

userSchema.virtual('myGroupes',{
    ref:'Groupe',
    localField: '_id',
    foreignField: 'membres'
})

//add a virtual relation between event and publication
userSchema.virtual('publications',{
    ref:'Publication',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('likes',{
    ref:'Publication',
    localField: '_id',
    foreignField: 'likes'
})

userSchema.virtual('comments',{
    ref:'Comment',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.virtual('sendernotif',{
    ref: 'Notification',
    localField:'_id',
    foreignField: 'sender'
})

userSchema.virtual('receivernotif',{
    ref: 'Notification',
    localField:'_id',
    foreignField: 'receiver'
})



const User = mongoose.model('User', userSchema)


module.exports = User
