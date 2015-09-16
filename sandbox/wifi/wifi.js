var wifi = require('wifi-cc3000');
var http = require('http');

var network = "<%= WIFI_SSID %>";
var pass = "<%= WIFI_PASSWORD %>";
var security = "<%= WIFI_SECURITY %>";
var timeouts = <%= WIFI_TIMEOUTS %>;

function connect(){
    wifi.connect({
        security: security
        , ssid: network
        , password: pass
        , timeout: timeouts
    });
}

wifi.on('connect', function(data){
    // 無線LANに接続された
    console.log("connect emitted", data);
    requestHttp();
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

function requestHttp(){
    var statusCode = 200;
    var count = 1;

    setImmediate(function start () {
        console.log('http request #' + (count++))
        http.get("http://httpstat.us/" + statusCode, function (res) {
            console.log('# statusCode', res.statusCode)

            var bufs = [];
            res.on('data', function (data) {
                bufs.push(new Buffer(data));
                console.log('# received', new Buffer(data).toString());
            })
            res.on('end', function () {
                console.log('done.');
                if(count < 10) {
                    setImmediate(start);
                }
            })
        }).on('error', function (e) {
            console.log('not ok -', e.message, 'error event')
            setImmediate(start);
        });
    });
}

// runで強制的にリセットする。
powerCycle();
