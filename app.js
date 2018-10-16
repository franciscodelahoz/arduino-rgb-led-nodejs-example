const path    = require('path');
const socket  = require('socket.io');
const http    = require('http');
const express = require('express');
const app     = express();
const index   = require('./routes/index');

const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const helmet = require('helmet');
const compression = require('compression');

const server  = http.createServer(app);

app.use(helmet());
app.set('port', process.env.NODE_APPLICATION_PORT);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(compression());

io = socket.listen(server);

const rgbLedController = require('./bin/rgb_led_controller');
rgbLedController(io);

app.use('/', index);

server.listen(app.get('port'), function() {
	console.log(`Server Listening In Port: ${app.get('port')}`);
});
