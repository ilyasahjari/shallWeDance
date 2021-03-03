const express = require('express')
const mongoose = require ('mongoose')
const morgan = require ('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()


const UserRoute = require('./routes/users')
const EventRoute = require('./routes/events')
const GroupeRoute = require('./routes/groupes')
const PublicationRoute = require('./routes/publications')
const CommentRoute = require('./routes/comments')
const TypeRoute = require('./routes/dansetype')
const NotificationRoute = require('./routes/notification')
const RateRoute = require('./routes/rates')

mongoose.connect('mongodb+srv://shallwedance:shallwedance@cluster0.kwpgx.mongodb.net/shallWeDance?retryWrites=true&w=majority', { useNewUrlParser : true, useUnifiedTopology: true,useFindAndModify: false})
const db = mongoose.connection


db.on('error', (err)=> {
    console.log(err)
})

db.once('open', () => {
    console.log('DataBase OK')
})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();

    app.options('*', (req, res) => {
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});


app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended : true}))
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 3001

if(process.env.NODE_ENV === 'production'){
    //Set static folder
    app.use(express.static('client/build'))

    app.get('*', (req,res) => res.sendFile(path.resolve(__dirname,'client','build','index.html')))
}


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})


app.use('/api/event', EventRoute)
app.use('/api/user', UserRoute)
app.use('/api/groupe', GroupeRoute)
app.use('/api/publication', PublicationRoute)
app.use('/api/comment', CommentRoute)
app.use('/api/type', TypeRoute)
app.use('/api/notification',NotificationRoute)
app.use('/api/rate',RateRoute)

