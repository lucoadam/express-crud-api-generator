const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const generator = require('../index')
const DataModel = require('./models/Data')
require('dotenv').config();

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors())

const db = process.env.MONGOURL;

//Connect to mongo
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>{
        console.log('Mongo Connection Successful')
        app.enable('trust proxy');
    })
    .catch(err => console.log(err));

const port = process.env.PORT || 5000;
//generate crud for the path /data
generator(app,{path:'/data',modal:DataModel})
generator(app,{path:'/antoherPath',modal:DataModel})

app.listen(port, () => console.log('Server started on port 5000'));