const path = require('path');
const socket = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const index = require('./routes/index');

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use('/public', express.static(path.join(__dirname + '/public')));

io = socket.listen(server);

const rgbLedController = require('./bin/rgb_led_controller');
rgbLedController(io);

app.use('/', index);

server.listen(app.get('port'), function() {
	console.log("Server listening in port", app.get('port'));
});