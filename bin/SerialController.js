const SerialPortController = require('./SerialPortController');

SerialController = function(io, SelectedPort) {
	const SerialController = new SerialPortController(SelectedPort);

	SerialController.on('ready', () => {
		console.log('Serial Port Opened!');

		io.sockets.on('connection', (socket) => {
			socket.on('Arduino::color', (colorValue) => {
				const { r, g, b } = colorValue;
				const color = `R${r}G${g}B${b}\n`;
				SerialController.WritePort(color);
			});

			SerialController.on('message', (line) => {
				if (/^([RGB]\d+){3}$/.test(line)) {
					const [R, G, B] = line.match(/\d+/gi).map(color => Number(color));
					socket.emit('Color', { r: R, g: G, b: B });
				}
			});

			socket.on('disconnect', (data) => {
				console.log(`User Disconnected! ID: ${socket.id}`);
				socket.removeAllListeners();
				SerialController.removeAllListeners('message');
				delete io.sockets.sockets[socket.id];
			});
		});
	});
};

module.exports = SerialController;
