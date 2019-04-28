ApplicationController = function(io, SerialPort) {
	io.sockets.on('connection', (socket) => {
		console.log(`User Connected! ID: ${socket.id}`);

		socket.on('Arduino::color', (colorValue) => {
			const { r, g, b } = colorValue;
			const color = `R${r}G${g}B${b}\n`;
			SerialPort.WritePort(color);
		});

		socket.on('disconnect', (data) => {
			console.log(`User Disconnected! ID: ${socket.id}`);
			socket.removeAllListeners();
			delete io.sockets.sockets[socket.id];
		});
	});
};

module.exports = ApplicationController;
