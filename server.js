const inquirer = require('inquirer');
const SerialPortController = require('./bin/SerialPortController');
const { SocketsController, emitColor } = require('./bin/SocketsController');

const http = require('http');
const socket = require('socket.io');

const dotenv = require('dotenv');
dotenv.config({ path: '.env.example' });

function getQuestions(postsList) {
	const choices = postsList.map(port => {
		return {
			name: `${port.Name} ==> ${port.Port}`,
			value: port.Port
		};
	});

	return {
		type: 'list',
		message: 'Select the port where the Arduino is connected',
		name: 'Ports',
		choices: choices
	};
}

SerialPortController.SearchPorts().then(async ports => {
	const { Ports: SelectedPort } = await inquirer.prompt(getQuestions(ports));

	const SerialController = new SerialPortController(SelectedPort);

	const app = require('./app');
	const server = http.createServer(app);
	const io = socket.listen(server);

	SocketsController(io, SerialController);

	server.listen(process.env.NODE_APPLICATION_PORT, () => {
		console.log('Web server Listening!');
	});

	SerialController.on('ready', () => {
		console.log('Port Connected');
		emitColor(io.sockets, SerialController);
	});

	SerialController.on('reconnected', () => {
		console.log('Port Reconnected');
	});

	SerialController.on('closed', (msg) => {
		console.error(msg);
		io.sockets.emit('SerialDisconnected');
	});

	SerialController.on('error', (msg) => {
		console.error(msg);
	});

}).catch(error => { console.error(error); });
