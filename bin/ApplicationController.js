ApplicationController = function(io, SerialPort) {
	io.sockets.on('connection', (socket) => {
		console.log(`User Connected! ID: ${socket.id}`);

		socket.on('Arduino::color', (colorValue) => {
			const { r, g, b } = colorValue;
			const color = `R${r}G${g}B${b}\n`;
			SerialPort.WritePort(color);
		});

		SerialPort.on('message', (line) => {
			if (/^([RGB]([01]?[0-9]{1,2}|2[0-4][0-9]|25[0-4])){3}$/.test(line)) {
				const [R, G, B] = line.match(/\d+/gi).map(color => Number(color));
				socket.emit('Color', { r: R, g: G, b: B });
			}
		});

		socket.on('disconnect', (data) => {
			console.log(`User Disconnected! ID: ${socket.id}`);
			SerialPort.removeAllListeners();
			socket.removeAllListeners();
			delete io.sockets.sockets[socket.id];
		});
	});
};

module.exports = ApplicationController;
