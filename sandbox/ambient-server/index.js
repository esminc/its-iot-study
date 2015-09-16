/* wifi-cc3000というライブラリをrequireしていますが、
 * このライブラリはTesselのファームウェアに組み込まれているので、
 * npm installする必要はありません。
 * これは、require('tessel')でも同様です。
 */
var tessel = require('tessel');
var ambientlib = require('ambient-attx4');
var http = require('http');
var wifi = require('wifi-cc3000');
var network = '###'; // ネットワーク名を入れてください。
var pass = '###'; // パスワードを入れてください。パスワード無しの場合は、カラ文字列にしてください。
var security = 'wpa2'; // 他に「wep」「wpa」「unsecured」が指定できます。パスワード無しの場合は「unsecured」を指定してください。
var timeouts = 0;

var ambient = ambientlib.use(tessel.port['A']);

ambient.on('ready', function() {
  console.log('on ready ambient.');
  connect();
});

function connect(){
  wifi.connect({
    security: security
    , ssid: network
    , password: pass
    , timeout: 30 // in seconds
  });
}

wifi.on('connect', function(data){
  // 無線LANに接続された
  console.log("connect emitted", data);

  http.createServer(function (req, res) {
    ambient.getLightLevel(function(err, ldata) {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end(err.message);
        //throw err;
      }
      ambient.getSoundLevel(function(err, sdata) {
        if (err) {
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end(err.message);
        }
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("Light level:" + ldata.toFixed(8) + ' ' + "Sound Level:" + sdata.toFixed(8) + '\n');
        //console.log("Light level:" + ldata.toFixed(8), ' ', "Sound Level:" + sdata.toFixed(8));
      });
    });
  }).listen(1337, '127.0.0.1');
  console.log('Server running at http://' + data.ip + ':1337/');
});

wifi.on('disconnect', function(data){
  // 切断された。必要ならばもういちどconnect()を呼んでください。
  console.log("disconnect emitted", data);
})

wifi.on('timeout', function(err){
  // 接続しようとしたが、接続できなかった。リトライする。
  console.log("timeout emitted");
  timeouts++;
  if (timeouts > 2) {
    // 何度もタイムアウトしたので、無線LANチップをリセットする。
    powerCycle();
  } else {
    // 接続しなおす。
    connect();
  }
});

wifi.on('error', function(err){
  // 以下のいずれかが起きた。
  // 1. 接続されていないのに、切断しようとした。
  // 2. 接続しようとしている最中に、切断しようとした。
  // 3. タイムアウトまたは切断されていないのに、接続しようとした。
  console.log("error emitted", err);
});

// プログラムから、無線LANチップをリセットする。
function powerCycle(){
  // 無線LANチップをリセットすると、最後に保存されたネットワークに
  // 自動的に再接続する。
  wifi.reset(function(){
    timeouts = 0; // タイムアウト回数をゼロに戻す。
    console.log("done power cycling");
    // 自動的に再接続するのを待つ。
    setTimeout(function(){
      if (!wifi.isConnected()) {
        // 接続する。
        connect();
      }
      }, 20 *1000); // 20秒待つ
  })
}
