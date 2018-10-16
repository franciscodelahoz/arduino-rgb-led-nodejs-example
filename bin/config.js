const config = {
	NODE_APPLICATION_PORT: process.env.NODE_PORT || 3000,
	ARDUINO_SERIAL_COM_PORT: process.env.ARDUINO_SERIAL_COM_PORT || 'COM4'
};

module.exports = config;
