# its-iot-study
Document and SandBox codes for IoT study meet up 

## WiFiについて

`sandbox/wifi` に作成しました。

- `.env.default` を `.env` にコピーしてコメントの設定内容を変更
- wifi ディレクトリで `npm install` を実行
- `node_modules/.bin/gulp` を実行してコンパイル
- `tessel run dist/wifi.js` を実行

最大10回 `http://httpstat.us/` に通信します。

