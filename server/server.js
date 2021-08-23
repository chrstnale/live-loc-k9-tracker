const express = require('express'), 
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    path = require("path"),
    ports = 5000,
    cors = require("cors"),
    SerialPort = require ('serialport'),
    port = new SerialPort('/dev/ttyUSB0', {
        baudRate: 115200,
    }, err => {
        if(err!= null){
            console.log(err)
            return
        }
    })
    server.listen(ports, () => console.log(`Listening on port ${ports}!`))
    app.use(express.static(path.join(__dirname, "../client", "build")));
    app.use(express.static('public'));
    app.use(cors());
    // app.use((req, res, next) => {
    //     res.sendFile(path.join(__dirname, "../client", "/build", "index.html"));
    //   });
// const body = [];

io.on('connection', onConnection);
var connectedSocket = null;
function onConnection(socket){
    connectedSocket = socket;
}

var stream
app.get('/data', (req,res) => {
    port.setMaxListeners(9000)
    port.on('data', data => {

        data= JSON.stringify(data)
        data = JSON.parse(data)
        stream = String.fromCharCode.apply(String,data.data).replace(`\r\n`,'');
        stream = stream.split(",")
        console.log(data);
        if (stream.length > 5){
            stream = {
                "no": parseInt(stream[0]),
                "lat": parseFloat(stream[1]),
                "lng": parseFloat(stream[2]),
                "gas": parseInt(stream[3]),
                "Status":(stream[4])
            }
        } 
        io.emit('serialdata', {data: stream})
        console.log(stream);
        // body.push(stream)
    })
    res.json(stream)
})
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "client/public", "index.html"));
//    });