const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path');

const route = require('./routes/posts')

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', route);

const PORT = 5000;

const mongoDB = process.env.MONGO_DB;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => app.listen(PORT, () => console.log(`listening on port ${PORT}`)))
    .catch(err => console.log(err.message));

    if(process.env.NODE_ENV === "production") {
        app.use(express.static('client/build'));
    
        app.get('*', (req, res) => {
            res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
        })
    } else {
        app.get('/', (req, res) => {
            res.send('Api running');
        })
    }

