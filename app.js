const path = require('path');
const express = require('express');
const compression = require('compression');

const app = express();

const helmet = require('helmet');
const auth = require('./bin/authentication/auth');

const index = require('./routes/index');

app.use(compression());
app.use(helmet());
app.use(auth);

app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/', index);

module.exports = app;
