const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = require('./routes/router');

const corsOptions = {
    origin: true,
    credentials: true,
};

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);

module.exports = app;
