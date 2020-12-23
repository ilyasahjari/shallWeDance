const express = require('express')
const mongoose = require ('mongoose')
const morgan = require ('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()


const EventRoute = require('./routes/events')


mongoose.connect('mongodb://localhost:27017/shallWeDance', { useNewUrlParser : true, useUnifiedTopology: true})
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

app.use('/api/event',EventRoute)

