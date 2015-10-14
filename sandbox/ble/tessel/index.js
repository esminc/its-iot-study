var tessel = require('tessel');
var bleLib = require('ble-ble113a');
var bleadvertise = require('bleadvertise');

var packet = {
  flags: [0x02, 0x04], // Connectable, BLE only
  incompleteUUID128 : ['08c8c7a06cc511e3981f0800200c9a66'], // Tessel Firmware Version Service UUID
  shortName : 'Tessel'
}

var ad = bleadvertise.serialize(packet);

var peripheral = bleLib.use(tessel.port['A'], function(){
  peripheral.setAdvertisingData(ad, function(){
    peripheral.startAdvertising();
    console.log('Now advertising');
  });
});