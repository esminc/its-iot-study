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
