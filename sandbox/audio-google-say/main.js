var tessel = require('tessel');
var fs = require('fs');
var stream = require('stream');
var request = require('request');
var wifi   = require('wifi-cc3000');
var audio = require('audio-vs1053b').use(tessel.port['A']);

var led_green = tessel.led[0].output(1);
setInterval(function(){
  led_green.toggle()
}, 200);

var getAudioStream = function(speech_text){
  return request.get({
    uri: 'http://translate.google.com/translate_tts',
    qs: {
      ie: 'UTF-8',
      q: speech_text,
      tl: 'ja',
      total: 1,
      idx: 0,
      client: 't'
    },
    headers: {
      'User-Agent': 'Mozilla'
    }
  });
};

var say = function(speech_text){
  console.log('say:'+speech_text);
  if(!wifi.isConnected()){
    console.error('wifi is not connected');
    return;
  }
  var buf = new Buffer(10240);
  var offset = 0;
  var ws = stream.Writable({decodeStrings: false});
  ws._write = function(chunk, enc, next){
    if(chunk.length > buf.length - offset){
      return next(new Error('buffer over'));
    }
    buf.write(chunk, offset, buf.length - offset);
    offset += chunk.length;
    next();
  };
  var req = getAudioStream(speech_text);
  req.pipe(ws);
  req.on('end', function(){
    console.log(buf);
    audio.play(buf, function(err){
      if(err) return console.error(err);
      console.log('audio done');
    });
  });
};

audio.on('ready', function(){
  console.log('audio ready');
  audio.setVolume(20, function(err){
    if(err) return console.error(err);
    audio.emit('ready:volume');
  });
});

audio.on('ready:volume', function(){
  console.log('audio ready:volume');
  if(err) return console.error(err);
  setInterval(function(){
    say('うどん居酒屋 かずどん');
  }, 30*1000);
  say('焼肉ざんまい');
});

