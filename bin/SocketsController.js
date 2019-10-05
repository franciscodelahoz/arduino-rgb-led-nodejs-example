function getRGBColor(line) {
	let [r, g, b] = [0, 0, 0];

	if (/^([RGB]([01]?[0-9]{1,2}|2[0-4][0-9]|25[0-5])){3}$/.test(line)) {
		[r, g, b] = line.match(/\d+/gi).map(color => Number(color));
	}

	return { r, g, b };
}

async function getColorFromPort(SerialObject) {
	let color = null;

	try {
		let DataFromSerial = await SerialObject.WriteAndReadPort('\n', 3000);
		color = getRGBColor(DataFromSerial);
	} catch (error) { console.log(error); }

	return color;
}

async function emitColor(socket, SerialPort) {
	const eColor = await getColorFromPort(SerialPort);
	socket.emit('Color', eColor);
}

function SocketsController(io, SerialPort) {
	io.sockets.on('connection', async (socket) => {
		console.log(`User Connected! ID: ${socket.id}`);

		await emitColor(socket, SerialPort);

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
}

module.exports = {
	SocketsController: SocketsController,
	emitColor: emitColor
};
