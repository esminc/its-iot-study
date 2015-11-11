var tessel = require('tessel');
var http = require('http');
var url = require('url');
var camera = require('camera-vc0706').use(tessel.port['A']);
var cameraOn = tessel.led[3];
var EventEmitter = require('events').EventEmitter;
var image = null;
var server = null;

var event = new EventEmitter;

camera.on('ready', function() {
  console.info("Camera Ready!!");
  camera.setResolution('qqvga', function(err){
    console.log("setResolution qqvga");
    if(err) throw 'setting camera resolution failed!';
    event.emit('camera:ready');
  });
});

event.on('camera:ready', function() {
  event.emit('camera:takePicture');
  server = http.createServer(function (req, res) {
    event.emit('http:request', req, res);
  });
  server.listen(80);
});

event.on('http:request', function(req, res) {
  var urlObj = url.parse(req.url, true);
  console.info("Receive request: "+urlObj.pathname);

  if (urlObj.pathname === '/') {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(homepage(), 'utf8');
    res.end();
  } else if (urlObj.pathname === '/photo.jpg') {
    console.log("GET photo.jpg");
    camera.takePicture(function (err, image) {
      res.writeHead(200, {'Content-Type': 'images/jpeg',
                          'Content-Disposition': 'attachment; filename=photo.jpg'});
      res.write(image);
      res.end();
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.write(errorpage(), 'utf8');
    res.end();
  }
  server.listen(80);
});

event.on('camera:takePicture', function() {
  console.log("**** take a photo");
  cameraOn.high();
  camera.takePicture(function (err, data) {
    cameraOn.low();
    image = data;
    setTimeout(function(){
      event.emit('camera:takePicture');
    }, 100);
  });
});

camera.on('error', function(err) {
  console.error(err);
});

/* html generators */
function style() {
  return "<style> img, h1, a { display: block; margin: 10px } </style>";
}
function jquery() {
  return "<script src='https://code.jquery.com/jquery-1.11.3.min.js'></script>";
}
function reloadScript() {
  return "<script type='text/javascript'>"+
            "$(document).ready(function(){"+
              "$('#photo').on('load', function() {"+
                "setTimeout(function(){ "+
                  "$('#photo').attr('src', './photo.jpg?dl='+(+new Date())); "+
                "}, 200);"+
              "});"+
            "});"+
          "</script>";
}
function head() {
  return "<title>Sneaky Tessel</title>" + style() + jquery() + reloadScript();
}
function body(content) {
  return "<!DOCTYPE html>\n<html language='en'><head>" + head() + "</head>\n" +
    "<html>" + content + "</html>\n\n";

}
function homepage() {
  return body("<h1>What are you looking at?</h1><img id='photo' src='./photo.jpg?dl="+(+new Date())+"' alt='sneaky'><a href='./'>Reload</a>");
}
function errorpage() {
  return body("<p>These are not the droids you are looking for</p>")
}