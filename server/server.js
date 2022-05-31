const express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    path = require("path"),
    ports = 5000,
    cors = require("cors"),
    SerialPort = require('serialport'),
    port = new SerialPort('/dev/ttyUSB0', {
        baudRate: 115200,
    }, err => {
        if (err != null) {
            console.log(err)
            return
        }
    })
server.listen(ports, () => console.log(`Listening on port ${ports}!`))
app.use(express.static(path.join(__dirname, "../client", "build")));
app.use(express.static('public'));
app.use(cors());

var connectedSocket = null;
io.on('connection', socket=> {
    connectedSocket = socket;
});

// Declare arrays for dog list, markers, and polyline
var stream
var status
port.setMaxListeners(9000)
port.on('data', data => {
    data = JSON.stringify(data)
    data = JSON.parse(data)
    stream = String.fromCharCode.apply(String, data.data).replace(`\r\n`, '');
    stream = stream.split(",")
    console.log(data);
    console.log(stream.length)
    if(stream[5] == 78){
        console.log('mencari')
        status = 'T'
    } else{
        console.log('ketemu!')
        status = 'P'
    }
    if(stream.length===6 && stream[2] !== 0 && stream[3] !== 0){
        console.log(stream)
        console.log(status)
        io.emit('serialdata', { lat: stream[2], lng: stream[3], gas: 1, status: status})
    }
       
})

// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, "../client", "/build", "index.html"));
//   });
// const body = [];