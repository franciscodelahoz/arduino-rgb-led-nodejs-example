const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const EventEmitter = require('events').EventEmitter;

class SerialPortController extends EventEmitter {
	constructor(SelectedPort) {
		super();
		this.SelectedPort = SelectedPort;
		this.LineParser = new Readline({ delimiter: '\n' });
		this.OpenPort();
	}

	OpenPort() {
		this.serialPort = new SerialPort(this.SelectedPort, {
			baudRate: 115200
		});

		this.serialPort.pipe(this.LineParser);

		this.serialPort.on('open', () => {
			this.emit('ready');
		});

		this.LineParser.on('data', (line) => {
			this.emit('message', line);
		});

		this.serialPort.on('close', () => {
			this.emit('closed', 'Serial Port Closed');
			this.ReconnectPort();
		});

		this.serialPort.on('error', (error) => {
			this.emit('error', error);
			this.ReconnectPort();
		});
	}

	ReconnectPort() {
		console.log('Reconnecting To Port...');

		setTimeout(() => {
			if (!this.IsOpen()) { this.OpenPort(); }
		}, 5000);
	}

	WritePort(message) {
		this.serialPort.write(message);
	}

	ReadPort(src) {
		return new Promise((resolve, reject) => {
			this.WritePort(src);

			this.LineParser.once('data', (data) => {
				resolve(data.toString());
			});

			this.serialPort.once('error', (err) => {
				reject(err);
			});
		});
	}

	IsOpen() {
		return this.serialPort.isOpen;
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
}

module.exports = SerialPortController;
