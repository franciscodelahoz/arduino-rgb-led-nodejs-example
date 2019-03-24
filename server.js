const inquirer = require('inquirer');
const SerialPortController = require('./bin/SerialPortController');

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
		const SerialController = new SerialPortController(answers.Ports);

		SerialController.on('ready', () => {
			console.log('Serial Port Opened!');
			require('./app')(SerialController);
		});

	}).catch(error => { console.log(error); });
}).catch(error => { console.log(error); });
