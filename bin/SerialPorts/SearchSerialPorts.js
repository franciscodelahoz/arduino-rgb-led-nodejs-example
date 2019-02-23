const SerialPort = require('serialport');

exports.SearchPorts = function() {
	return new Promise((resolve, reject) => {
		SerialPort.list((error, ports) => {
			if (error) { reject(error); }

			if (!ports.length) {
				reject('No se han encontrado dispositivos conectados');
			}

			let FindedPorts = ports.map(port => {
				return { Port: port.comName, Name: port.manufacturer };
			});

			resolve(FindedPorts);
		});
	});
};
