# BLE

Bluetoothで何かを実現するためのサンプルです。

## ディレクトリ構造

- tessel
    - tesselでBLEの広告配信をするためのサンプルコード。
    - [公式チュートリアル](https://github.com/tessel/t1-docs/blob/master/tutorials/ble-getting-started.md#advertisements)を利用しています

- html5(TODO)
    - [chrome.bluetooth](https://developer.chrome.com/apps/bluetooth)を使ってHTML5アプリとして実現する予定
    - node.js の express とかで簡易にwebサーバをたてて、静的コンテンツを配信する予定
    
## 接続テスト

必要なもの

- tessel本体
- BLE（ポートAに接続）
- Macbook（node.js必須、Bluetoothが利用できればWindowsでも可）

### tessel側

- 上記tesselのディレクトリで `npm install` を実行
- `tessel run index.js` を実行

### Macbook

- [BLE Beacon](https://github.com/tomovwgti/BLEbeacon) をクローンする（適当なディレクトリで）
    - `git clone git@github.com:tomovwgti/BLEbeacon.git`
    - `cd BLEbeacon`
    - `npm install`
- `noble`のバージョンが古くてコンパイルエラーになる場合、一旦削除して追加する
    - `npm uninstall noble --save`
    - `npm install noble --save`
    - `npm install`
- `node ble-discovery.js` を実行

### コンソール出力

tesselをMacに近づける（USBケーブルでつながっている場合、どのみち近いので認識されてしまう）と、

```
peripheral discovered (4b99052b918748fba9b27485ecd72736):
hello my local name is:
Tessel
can I interest you in any of the following advertised services:
["08c8c7a06cc511e3981f0800200c9a66"]
here is my service data:
""
```

のようにMacbook上に出力され、TesselからのBLEが受信できていることがわかる


