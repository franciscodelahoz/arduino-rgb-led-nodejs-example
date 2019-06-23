const DestroyServerOnError = async function(server) {
	try {
		await server.destroy();
	} catch (err) { console.log(new Error(err).message); }
};

const getRGBColor = function(line) {
	let [R, G, B] = [0, 0, 0];
	if (/^([RGB]([01]?[0-9]{1,2}|2[0-4][0-9]|25[0-5])){3}$/.test(line)) {
		[R, G, B] = line.match(/\d+/gi).map(color => Number(color));
	}
	return { r: R, g: G, b: B };
};

async function EmitColorOnConnection(SocketClient, SerialObject) {
	let color = { r: 0, g: 0, b: 0 };

	try {
		let DataFromSerial = await SerialObject.WriteAndReadPort('\n', 3000);
		color = getRGBColor(DataFromSerial);
	} catch (error) { console.log(error); }

	SocketClient.emit('Color', color);
}

module.exports = {
	DestroyServerOnError: DestroyServerOnError,
	EmitColorOnConnection: EmitColorOnConnection
};
