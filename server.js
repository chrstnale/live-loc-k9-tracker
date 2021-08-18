var http = require('http');
var express = require('express');
var app = express();
var SerialPort = require("serialport").SerialPort;
var server = http.createServer(app).listen(3000);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'));

var serialport = new SerialPort("/dev/tty.usbmodem");
serialport.on('open', function(){
    // Arduino connected
    console.log('Serial Port Opend');
    
    var lastValue;
    io.sockets.on('connection', function (socket) {
        console.log('Socket connected');
        socket.emit('connected');
        var lastValue; 
        
        serialport.on('data', function(data){
            var point = data[0];
            if(lastValue !== point){
                socket.emit('data', point);
            }
            lastValue = point;
        });
    });
});