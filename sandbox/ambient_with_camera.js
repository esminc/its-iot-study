// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/


/******************************************************
 環境センサとカメラとの組み合わせ
 環境センサで一定の音量を検知したら写真を撮る
 実行方法 tessel run ambient_camera.js --upload-dir ./
******************************************************/
var tessel = require('tessel');
var cameralib = require('camera-vc0706');
var ambientlib = require('ambient-attx4');

var camera = cameralib.use(tessel.port['A']);
var ambient = ambientlib.use(tessel.port['B']);

var notificationLED = tessel.led[3];

camera.on('ready', function() {
  console.log('Camera ready On!');
});

ambient.on('ready', function () {
 // Get points of light and sound data.
  setInterval( function () {
    ambient.getLightLevel( function(err, ldata) {
      if (err) throw err;
      ambient.getSoundLevel( function(err, sdata) {
        if (err) throw err;
        console.log("Light level:", ldata.toFixed(8), " ", "Sound Level:", sdata.toFixed(8));
    });
  })}, 500); // The readings will happen every .5 seconds unless the trigger is hit

  ambient.setLightTrigger(0.5);

  // Set a light level trigger
  // The trigger is a float between 0 and 1
  ambient.on('light-trigger', function(data) {
    console.log("Our light trigger was hit:", data);

    // Clear the trigger so it stops firing
    ambient.clearLightTrigger();
    //After 1.5 seconds reset light trigger
    setTimeout(function () {

        ambient.setLightTrigger(0.5);

    },1500);
  });

  // Set a sound level trigger
  // The trigger is a float between 0 and 1
  ambient.setSoundTrigger(0.1);

  ambient.on('sound-trigger', function(data) {
    console.log("Something happened with sound: ", data);
    
    //camera-pic
    takePic();

    // Clear it
    ambient.clearSoundTrigger();

    //After 1.5 seconds reset sound trigger
    setTimeout(function () {

        ambient.setSoundTrigger(0.1);

    },1500);

  });
});

//カメラで撮影
function takePic() {
  notificationLED.high();
  // Take the picture
  camera.takePicture(function(err, image) {
    console.log('--- takePicture start ---');
    if (err) {
      console.log('error taking image', err);
    } else {
      notificationLED.low();
      // Name the image
      var name = 'picture-' + Math.floor(Date.now()*1000) + '.jpg';
      // Save the image
      console.log('Picture saving as', name, '...');
      process.sendfile(name, image);
      console.log('done.');
    }
  });
};

ambient.on('error', function (err) {
  console.log(err)
});

camera.on('error', function (err) {
  console.log('camera-err' + err);
});
