const inquirer = require('inquirer');
const SearchSerialPorts = require('./bin/SerialPorts/SearchSerialPorts');

SearchSerialPorts.SearchPorts()
	.then(ports => {
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
			require('./app')(answers.Ports);

		}).catch(error => {
			console.log(error);
		});

	}).catch(error => { console.log(error); });
