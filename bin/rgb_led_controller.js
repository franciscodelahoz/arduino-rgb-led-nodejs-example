const SerialPort = require('serialport');

module.exports = function(io) {
	var serialPort = new SerialPort(process.env.ARDUINO_SERIAL_COM_PORT, {
		baudRate: 115200
	});

	serialPort.on('open', function() {
		console.log('Serial Port Opened!');
	});

	serialPort.on('error', function(error) {
		console.log('Has ocurred a error: ', error);
	});

	io.sockets.on('connection', function(socket) {
		console.log('A New User Has Connected!');

		socket.on('Arduino::color', function(colorValue) {
			const { red, green, blue } = colorValue;
			const color = `R${red}G${green}B${blue}\n`;

			serialPort.write(color);
		});
	});

	serialPort.on('data', function(data) {
		console.log(data.toString());
	});
};
