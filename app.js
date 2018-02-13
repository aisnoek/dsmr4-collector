const port = '/dev/ttyUSB0'
const SerialPort = require('serialport')
const parser = require('./src/parser')
const store = require('json-fs-store')('./statistics')

var sp = new SerialPort(port, {
  baudRate: 115200,
  dataBits: 8,
  stopBits: 1,
  parity: 'none'
})

sp.on('open', function () {
  console.log('Listening to: ' + port);

  var buffer = '';

  sp.on('data', function (data) {
    buffer += data.toString()

    var startCharPos = buffer.indexOf('/');
    var endCharPos = buffer.indexOf('!');

    if (startCharPos >= 0 && endCharPos >= 0) {
      var packet = buffer.substr(startCharPos, endCharPos - startCharPos);
      var parsed = parser(packet);
      
      store.add(parsed, function(err) {
        if (err) {
            console.error('json-store-error', err)
	}
      } );

      buffer = ''
    }
  })
})

sp.on('error', function (err) {
  console.log('error', err);
})

sp.on('close', function () {
  console.log('close', arguments);
})
