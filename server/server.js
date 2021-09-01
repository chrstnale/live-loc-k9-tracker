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
// app.use((req, res, next) => {
//     res.sendFile(path.join(__dirname, "../client", "/build", "index.html"));
//   });
// const body = [];

io.on('connection', onConnection);
var connectedSocket = null;
function onConnection(socket) {
    connectedSocket = socket;
}

// Declare arrays for dog list, markers, and polyline
var stream
var markers = []
// var latlngs = [];
// var distMarkerList = [];
var dogList = [];

// Icon settings
// function getColor(index) {
//     var color;
//     switch (index) {
//         case 0:
//             color = '#86efa0';
//             break;
//         case 1:
//             color = '#e0b05e';
//             break;
//         case 2:
//             color = '#fc8082';
//             break;
//         case 3:
//             color = '#cc6ae2';
//             break;
//         case 4:
//             color = '#58d3a2';
//             break;
//         case 5:
//             color = '#4834a3';
//             break;
//         default:
//             color = randomColor();
//             break;
//     }
//     return color;

// }
// function updateDogList(stream, dogList){
//     console.log('apa itu parameter dogList', dogList)
//     console.log('apa doglist array kosong?', (dogList == []))
//     if(dogList === []){
//         dogList.push(markers[0])
//         console.log('First dogList', dogList)
//     }
//     for(i=0;i<dogList.length;i++){
//         if (stream.no === dogList[i].no){
//             dogList[i] = stream
//             console.log('stream.no', stream.no)
//             console.log('dogList.no', dogList[i].no)
//             console.log('Update dogList', dogList)
//             return dogList
//         }
//     }
//     console.log('stream.no', stream.no)
//     console.log('dogList.no', dogList[i].no)
//     dogList.push([stream])
//     console.log('pushed new dog', dogList)
//     return dogList
// }

app.get('/data', (req, res) => {
    port.setMaxListeners(9000)
    port.on('data', data => {

        data = JSON.stringify(data)
        data = JSON.parse(data)
        stream = String.fromCharCode.apply(String, data.data).replace(`\r\n`, '');
        stream = stream.split(",")
        console.log(data);
        stream = {
            "no": parseInt(stream[1]),
            "lat": parseFloat(stream[2]),
            "lng": parseFloat(stream[3]),
            "gas": parseInt(stream[4]),
            "Status": (stream[5]),
        }
        markers.push(stream)
        dogList = markers.filter((elem, index) =>
            markers.findIndex(obj => obj.no === elem.no) === index);
        
        var prevStream;
        if(prevStream !== stream){
            console.log('data added:', stream)
            io.emit('serialdata', { dogList: dogList, newData: stream})
            prevStream = stream;
        }
    })
    res.json(stream)
})