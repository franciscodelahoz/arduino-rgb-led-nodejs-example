const inquirer = require('inquirer');
const SerialPortController = require('./bin/SerialPortController');
const ApplicationController = require('./bin/ApplicationController');

const http = require('http');
const socket = require('socket.io');

const enableServer = require('server-destroy');
const util = require('util');

const dotenv = require('dotenv');
dotenv.config({ path: '.env.example' });

SerialPortController.SearchPorts().then(ports => {
	inquirer.prompt([{
		type: 'list',
		message: 'Select the port where the Arduino is connected',
		name: 'Ports',
		choices: ports.map(port => {
			return {
				name: `${port.Name} ==> ${port.Port}`,
				value: port.Port
			};
		})
	}]).then(answers => {
		const SelectedPort = answers.Ports;
		const SerialController = new SerialPortController(SelectedPort);

		const app = require('./app');
		const server = http.createServer(app);
		const io = socket.listen(server);

		enableServer(server);
		server.destroy = util.promisify(server.destroy);

		ApplicationController(io, SerialController);

		SerialController.on('ready', () => {
			console.log('Port Connected');

			server.listen(process.env.NODE_APPLICATION_PORT, () => {
				console.log('Web server Listening!');
			});
		});

		SerialController.on('closed', async (msg) => {
			console.log(msg);
			try {
				await server.destroy();
			} catch (err) { console.log(new Error(err).message); }
		});

		SerialController.on('error', async (msg) => {
			console.log(msg);
			try {
				await server.destroy();
			} catch (err) { console.log(new Error(err).message); }
		});

	}).catch(error => { console.log(error); process.exit(0); });
}).catch(error => { console.log(error); process.exit(0); });
