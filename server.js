const inquirer = require('inquirer');
const SerialPortController = require('./bin/SerialPortController');
const SocketsController = require('./bin/SocketsController');
const { emitColor } = require('./bin/ServerHandlers');

const http = require('http');
const { Server } = require('socket.io');

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
	const io = new Server(server);

	SocketsController(io, SerialController);

	server.listen(process.env.NODE_APPLICATION_PORT, () => {
		console.log('Web server Listening!');
	});

	SerialController.on('ready', () => {
		console.log('Port Connected');
		io.sockets.emit('SerialConnected');
	});

	SerialController.on('reconnected', async () => {
		console.log('Port Reconnected');
		io.sockets.emit('SerialReconnected');

		setTimeout(async () => {
			await emitColor(io.sockets, SerialController);
		}, 1500);
	});

	SerialController.on('closed', (msg) => {
		console.error(msg);
		io.sockets.emit('SerialDisconnected');
	});

	SerialController.on('error', (msg) => {
		console.error(msg);
	});

}).catch(error => { console.error(error); });
