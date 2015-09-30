# 音声再生

google translate API を使ってTesselにしゃべらせます

## 元ネタ

[tesselに日本語を喋らせる](http://shokai.org/blog/archives/9507)

## インストール

% npm install

## 必要なボード

Tessel本体にAudioボードを接続し、スピーカーを接続してください。
ヘッドホンでもOKです。

## 事前準備

Tesselのwifiコマンドもしくは、sandoxのwifiプロジェクトを実行してWifi接続をONの状態にしておいてください。
このJSにはWifi接続は含みません

## 実行

% tessel run main.js

## 元ネタの修正点

Google Translate APIの仕様が変更となったのか、元のパラメータでは動作しなかったので、本コードではパラーメータを変更しています。

元ネタ：

``` js
var getAudioStream = function(speech_text){
  return request.get({
    uri: 'http://translate.google.com/translate_tts',
    qs: {
      q: speech_text,
      tl: 'ja'
    },
    headers: {
      'User-Agent': 'Safari/1.0'
    }
  });
};
```

変更後：

``` js
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
```

