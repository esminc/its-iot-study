# SSHでArduino に繋ぐ

```
 $ ssh root@192.168.128.40

 BusyBox v1.19.4 (2014-04-10 11:08:41 CEST) built-in shell (ash)
 Enter 'help' for a list of built-in commands.

   _______                     ________        __
  |       |.-----.-----.-----.|  |  |  |.----.|  |_
  |   -   ||  _  |  -__|     ||  |  |  ||   _||   _|
  |_______||   __|_____|__|__||________||__|  |____|
           |__| W I R E L E S S   F R E E D O M
  -----------------------------------------------------
```

# ruby インストール

```
root@KunouArduino:~# opkg update
Downloading http://downloads.arduino.cc/openwrtyun/1/packages/Packages.gz.
Updated list of available packages in /var/opkg-lists/attitude_adjustment.
Downloading http://downloads.arduino.cc/openwrtyun/1/packages/Packages.sig.
Signature check passed.
root@KunouArduino:~# opkg list | grep ruby
libruby - 1.9.3-p429-1 - Ruby scripting language (shared library)
ruby - 1.9.3-p429-1 - Ruby is the interpreted scripting language for quick and  easy object-oriented programming.  It has many features to process text files  and to do system management tasks (as in perl).  It is simple,  straight-forward, and extensible.
ruby-cgi - 1.9.3-p429-1 - Ruby CGI support toolkit
ruby-core - 1.9.3-p429-1 - Ruby standard libraries
ruby-dl - 1.9.3-p429-1 - Ruby scripting language (dynamic linker support) (adds 5MB+)
ruby-enc - 1.9.3-p429-1 - Ruby scripting language (character re-coding library) (adds 2MB+)
ruby-erb - 1.9.3-p429-1 - Ruby scripting language (embedded interpreter)
ruby-gdbm - 1.9.3-p429-1 - Ruby support for gdbm
ruby-gems - 1.9.3-p429-1 - Ruby gems packet management
ruby-irb - 1.9.3-p429-1 - Ruby scripting language (interactive shell)
ruby-json - 1.9.3-p429-1 - Ruby support for JSON
ruby-ncurses - 1.9.3-p429-1 - Ruby support for ncurses
ruby-nkf - 1.9.3-p429-1 - Ruby Network Kanji Filter
ruby-openssl - 1.9.3-p429-1 - Ruby support for openssl
ruby-rake - 1.9.3-p429-1 - Ruby scripting language Ruby Rake (make replacement)
ruby-rdoc - 1.9.3-p429-1 - Ruby scripting language (documentation generator)
ruby-readline - 1.9.3-p429-1 - Ruby support for readline
ruby-rexml - 1.9.3-p429-1 - Ruby XML toolkit
ruby-rss - 1.9.3-p429-1 - Ruby RSS toolkit
ruby-unit - 1.9.3-p429-1 - Ruby unit testing toolkit
ruby-webrick - 1.9.3-p429-1 - Ruby Web server toolkit
ruby-xmlrpc - 1.9.3-p429-1 - Ruby XML-RPC toolkit
ruby-yaml - 1.9.3-p429-1 - Ruby YAML toolkit
ruby-zlib - 1.9.3-p429-1 - Ruby support for zlib
root@KunouArduino:~# opkg install ruby-core
Installing ruby-core (1.9.3-p429-1) to root...
Downloading http://downloads.arduino.cc/openwrtyun/1/packages/ruby-core_1.9.3-p429-1_ar71xx.ipk.
Installing ruby (1.9.3-p429-1) to root...
Downloading http://downloads.arduino.cc/openwrtyun/1/packages/ruby_1.9.3-p429-1_ar71xx.ipk.
Installing libruby (1.9.3-p429-1) to root...
Downloading http://downloads.arduino.cc/openwrtyun/1/packages/libruby_1.9.3-p429-1_ar71xx.ipk.
Installing libdb47 (4.7.25.NC-6) to root...
Downloading http://downloads.arduino.cc/openwrtyun/1/packages/libdb47_4.7.25.NC-6_ar71xx.ipk.
Installing libxml2 (2.7.8-2) to root...
Downloading http://downloads.arduino.cc/openwrtyun/1/packages/libxml2_2.7.8-2_ar71xx.ipk.
Configuring libruby.
Configuring ruby.
Configuring libxml2.
Configuring libdb47.
Configuring ruby-core.
```

```
root@KunouArduino:~# ruby -v
ruby 1.9.3p429 (2013-05-15 revision 40747) [mips-linux]
```

:sob:

```
root@KunouArduino:~/ruby/hello# opkg install ruby-gems
Installing ruby-gems (1.9.3-p429-1) to root...
Downloading http://downloads.arduino.cc/openwrtyun/1/packages/ruby-gems_1.9.3-p429-1_ar71xx.ipk.
Installing ruby-yaml (1.9.3-p429-1) to root...
Downloading http://downloads.arduino.cc/openwrtyun/1/packages/ruby-yaml_1.9.3-p429-1_ar71xx.ipk.
Installing ruby-zlib (1.9.3-p429-1) to root...
Downloading http://downloads.arduino.cc/openwrtyun/1/packages/ruby-zlib_1.9.3-p429-1_ar71xx.ipk.
Installing ruby-openssl (1.9.3-p429-1) to root...
Downloading http://downloads.arduino.cc/openwrtyun/1/packages/ruby-openssl_1.9.3-p429-1_ar71xx.ipk.
Installing ruby-webrick (1.9.3-p429-1) to root...
Downloading http://downloads.arduino.cc/openwrtyun/1/packages/ruby-webrick_1.9.3-p429-1_ar71xx.ipk.
Installing ruby-erb (1.9.3-p429-1) to root...
Downloading http://downloads.arduino.cc/openwrtyun/1/packages/ruby-erb_1.9.3-p429-1_ar71xx.ipk.
Configuring ruby-zlib.
Configuring ruby-yaml.
Configuring ruby-webrick.
Configuring ruby-erb.
Configuring ruby-openssl.
Configuring ruby-gems.
```

```
root@KunouArduino:~/ruby/hello# cat hello.rb
puts "Hello world"

root@KunouArduino:~/ruby/hello# ruby hello.rb
Hello world
```

## WEBrickを動かしてみた

``` ruby
# encoding: utf-8

require 'webrick'

server = WEBrick::HTTPServer.new({ :DocumentRoot => './', :Port => 20080})

trap 'INT' do server.shutdown end

server.mount_proc '/' do |req, res|
  res.body = 'Hello, world!'
end

server.start
```

![hello](https://github.com/esminc/its-iot-study/blob/master/doc/image/WEBrickOnYun.png?raw=true)
