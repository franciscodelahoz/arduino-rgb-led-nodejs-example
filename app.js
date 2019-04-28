const path = require('path');
const express = require('express');

const app = express();

const helmet = require('helmet');
const auth = require('./bin/authentication/auth');

const index = require('./routes/index');

app.use(helmet());
app.use(auth);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');
app.use('/public', express.static(path.join(__dirname, '/public')));

app.locals.pretty = true;

app.use('/', index);

module.exports = app;
