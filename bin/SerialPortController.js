const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const EventEmitter = require('events').EventEmitter;

class SerialPortController extends EventEmitter {
	constructor(SelectedPort) {
		super();
		this.SelectedPort = SelectedPort;
		this.MessageReader = new Readline({ delimiter: '\n' });
		this.OpenPort();
	}

	OpenPort() {
		this.serialPort = new SerialPort(this.SelectedPort, {
			baudRate: 115200
		});

		this.serialPort.pipe(this.MessageReader);

		this.serialPort.on('open', () => {
			if (!this.firstTimeOppened) {
				this.firstTimeOppened = true;
				this.emit('ready');

			} else {
				this.emit('reconnected');
			}
		});

		this.MessageReader.on('data', (line) => {
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

	WriteAndReadPort(src, delayInms) {
		return new Promise((resolve, reject) => {
			let eventFired = false;
			this.WritePort(src);

			function ResolveData(data) {
				eventFired = true;
				resolve(data.toString());
			}

			setTimeout(() => {
				if (!eventFired) {
					this.MessageReader.removeListener('data', ResolveData);
					reject('No data received');
				}
			}, delayInms);

			this.MessageReader.once('data', ResolveData);
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
					reject('No devices found!');
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
