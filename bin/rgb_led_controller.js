const SerialPort = require('serialport');

module.exports = function(io) {
  var serialPort = new SerialPort('COM3', {
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
      const color = `R${colorValue.r}G${colorValue.g}B${colorValue.b}\n`;
      serialPort.write(color);
    });
  });

  serialPort.on('data', function(data) {
    console.log(data.toString());
  });
};
