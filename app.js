module.exports = function(SerialPort) {
	const http = require('http');
	const path = require('path');
	const socket = require('socket.io');
	const express = require('express');

	const app = express();

	const dotenv = require('dotenv');
	dotenv.config({ path: '.env.example' });

	const helmet = require('helmet');
	const auth = require('./bin/authentication/auth');
	const SerialPortController = require('./bin/SerialPorts/SerialPortController');

	const index = require('./routes/index');

	const server = http.createServer(app);

	app.use(helmet());
	app.use(auth);
	app.set('port', process.env.NODE_APPLICATION_PORT);
	app.set('views', path.join(__dirname, '/views'));
	app.set('view engine', 'pug');
	app.use('/public', express.static(path.join(__dirname, '/public')));

	app.locals.pretty = true;

	io = socket.listen(server);

	app.use('/', index);

	SerialPortController.SerialController(io, SerialPort);

	server.listen(app.get('port'), function() {
		console.log(`Server Listening In Port: ${app.get('port')}`);
	});
};
