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
port.setMaxListeners(9000)
port.on('data', data => {
    data = JSON.stringify(data)
    data = JSON.parse(data)
    stream = String.fromCharCode.apply(String, data.data).replace(`\r\n`, '');
    stream = stream.split(",")
    console.log(data);
    console.log(stream)
    if(stream[1] !== undefined && stream[2] !== undefined){
        io.emit('serialdata', { lat: stream[2], lng: stream[3], gas: stream[4], status: stream[5], no: stream[1]})
    }
})

// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, "../client", "/build", "index.html"));
//   });
// const body = [];