var tessel = require('tessel');
var http = require('http');
var ws = require('nodejs-websocket');

var camera = require('camera-vc0706').use(tessel.port['B']);
var cameraOn = tessel.led[3];
var EventEmitter = require('events').EventEmitter;
var fs = require('fs');
var image = null;
var server = null;

var event = new EventEmitter;

camera.on('ready', function() {
  console.info("Camera Ready!!");
  camera.setResolution('qvga', function(err){
    console.log("setResolution qvga");
    if(err) throw 'setting camera resolution failed!';
    event.emit('camera:ready');
  });
});

event.on('camera:ready', function() {
  event.emit('camera:takePicture');
  server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(homepage(), 'utf8');
    res.end();
  });
  console.log("**** server listen");
  server.listen(80);
});

camera.on('error', function(err) {
  console.error(err);
});

// Create the websocket server, provide connection callback
var server = ws.createServer(function (conn) {
  console.log('Accepted new connection...');
}).listen(8080);

event.on('camera:takePicture', function() {
  console.log("**** take a photo");
  cameraOn.high();
  camera.takePicture(function (err, data) {
    cameraOn.low();
    console.log(server.connections);
    if(server.connections) {
      console.log("**** send a photo to clients:"+server.connections.length);
      server.connections.forEach(function (conn) {
        conn.sendText(JSON.stringify({ image: true, buffer: data.toString('base64') }), function() {
          console.log("**** send a photo");
        });
      });
    }
    setTimeout(function(){
      event.emit('camera:takePicture');
    }, 500);
  });
});

/* html generators */
function homepage() {
  return fs.readFileSync('index.html', 'utf8');
}
