const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const EventEmitter = require('events');

class SerialPortController extends EventEmitter {
	constructor(SelectedPort) {
		super();
		this.SelectedPort = SelectedPort;
		this.OpenPort();
	}

	OpenPort() {
		this.serialPort = new SerialPort(this.SelectedPort, {
			baudRate: 115200
		});

		const LineParser = new Readline({ delimiter: '\n' });
		this.serialPort.pipe(LineParser);

		this.serialPort.on('open', () => {
			this.emit('ready');
		});

		LineParser.on('data', (line) => {
			this.emit('message', line);
		});

		this.serialPort.on('close', () => {
			console.log('Port Closed');
			if (!this.serialPort.isOpen) { this.ReconnectPort(); }
		});

		this.serialPort.on('error', (error) => {
			console.log(error);
			if (!this.serialPort.isOpen) { this.ReconnectPort(); }
		});
	}

	ReconnectPort() {
		console.log('Reconnecting To Port...');
		setTimeout(() => {
			this.OpenPort();
		}, 5000);
	}

	WritePort(message) {
		this.serialPort.write(message);
	}

	static SearchPorts() {
		return new Promise((resolve, reject) => {
			SerialPort.list((error, ports) => {
				if (error) { reject(error); }

				if (!ports.length) {
					reject('Devices not found!');
				}

				let FindedPorts = ports.map(port => {
					return {
						Port: port.comName,
						Name: port.manufacturer
					};
				});

				resolve(FindedPorts);
			});
		});
	}
};

module.exports = SerialPortController;
