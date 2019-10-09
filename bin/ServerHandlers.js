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

async function emitColorWithStatus(socket, SerialPort) {
	const eColor = await getColorFromPort(SerialPort);
	socket.emit('Connected', { PortStatus: SerialPort.IsOpen(), Color: eColor });
}

module.exports = {
	getColorFromPort: getColorFromPort,
	emitColor: emitColor,
	emitColorWithStatus: emitColorWithStatus
};
