const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

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

exports.SerialController = function(io, SelectedPort) {
	var serialPort = new SerialPort(SelectedPort, {
		baudRate: 115200
	});

	const LineParser = new Readline({ delimiter: '\n' });
	serialPort.pipe(LineParser);

	serialPort.on('open', () => {
		console.log('Serial Port Opened!');

		io.sockets.on('connection', (socket) => {
			console.log(`A New User Has Connected! ID: ${socket.id}`);

			socket.on('Arduino::color', (colorValue) => {
				const { r, g, b } = colorValue;
				const color = `R${r}G${g}B${b}\n`;
				serialPort.write(color);
			});

			socket.on('RGB::Value', () => {
				serialPort.write('RGB_Value\n');
			});

			LineParser.on('data', (line) => {
				if (line.search('R') !== -1 && line.search('G') !== -1 && line.search('B') !== -1) {
					let r = Number(line.substring(line.indexOf('R') + 1, line.indexOf('G')));
					let g = Number(line.substring(line.indexOf('G') + 1, line.indexOf('B')));
					let b = Number(line.substring(line.indexOf('B') + 1, line.length));
					socket.emit('Color', { r: r, g: g, b: b });
				}
			});

			socket.on('disconnect', (data) => {
				console.log(`User Disconnected! ID: ${socket.id}`);
				socket.removeAllListeners();
				delete io.sockets.sockets[socket.id];
			});
		});
	});

	serialPort.on('error', (error) => {
		console.log('Has ocurred a error: ', error);
	});

	serialPort.on('close', (data) => {
		console.log('close');
	});
};
