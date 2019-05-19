const { getRGBColor } = require('../bin/ServerHandlers');

async function EmitColor(SocketClient, SerialObject) {
	let Data = 'R0G0B0';

	try {
		Data = await SerialObject.ReadPort('\n');
	} catch (error) { console.log(error); }

	const color = getRGBColor(Data);
	SocketClient.emit('Color', color);
}

SocketsController = function(io, SerialPort) {
	io.sockets.on('connection', (socket) => {
		console.log(`User Connected! ID: ${socket.id}`);
		EmitColor(socket, SerialPort);

		socket.on('Arduino::color', (colorValue) => {
			const { r, g, b } = colorValue;
			const color = `R${r}G${g}B${b}\n`;
			SerialPort.WritePort(color);
		});

		socket.on('picker', (color) => {
			socket.broadcast.emit('s_picker', color);
		});

		socket.on('slider_red', (redValue) => {
			socket.broadcast.emit('s_slider_red', redValue);
		});

		socket.on('slider_green', (greenValue) => {
			socket.broadcast.emit('s_slider_green', greenValue);
		});

		socket.on('slider_blue', (blueValue) => {
			socket.broadcast.emit('s_slider_blue', blueValue);
		});

		socket.on('input_red', (redValue) => {
			socket.broadcast.emit('s_input_red', redValue);
		});

		socket.on('input_green', (greenValue) => {
			socket.broadcast.emit('s_input_green', greenValue);
		});

		socket.on('input_blue', (blueValue) => {
			socket.broadcast.emit('s_input_blue', blueValue);
		});

		socket.on('disconnect', (data) => {
			console.log(`User Disconnected! ID: ${socket.id}`);
			socket.removeAllListeners();
			delete io.sockets.sockets[socket.id];
		});
	});
};

module.exports = SocketsController;
