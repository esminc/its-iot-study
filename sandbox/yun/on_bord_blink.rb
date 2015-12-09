require "rubygems"
require "arduino_firmata"

ArduinoFirmata.connect('/dev/cu.usbmodem1411') do
  10.times.each do |i|
    sleep 2
    digital_write 13, i.odd?
  end
end
