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
var latlngs = [];
var distMarkerList = [];
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

app.get('/data', (req, res) => {
    port.setMaxListeners(9000)
    port.on('data', data => {

        data = JSON.stringify(data)
        data = JSON.parse(data)
        stream = String.fromCharCode.apply(String, data.data).replace(`\r\n`, '');
        stream = stream.split(",")
        console.log(data);
        stream = {
            "no": parseInt(stream[0]),
            "lat": parseFloat(stream[1]),
            "lng": parseFloat(stream[2]),
            "gas": parseInt(stream[3]),
            "Status": (stream[4]),
        }
        markers.push(stream)
        console.log(stream);

        // If the dog's number ever been recorded, 
        // push the data to that that index, otherwise to new array
        // for(i=0;i<=dogList.length;i++){
        //     if (stream.no === dogList[i].no){
        //         dogList[i] = stream
        //     } else{
        //         dogList[dogList.length].push(stream)
        //     }
        // }

        // dogList[];
        // Get the dog list with last position
        dogList = markers.filter((elem, index) =>
            markers.findIndex(obj => obj.no === elem.no) === index);
        // console.log('dogNjing', dogList)
        // Booked array space for markers, and polyline
        for (var i = 0; i < dogList.length; i++) {
            distMarkerList.push([])
            latlngs.push([])
            // markerColors.push(getColor(i))
        }

        // Get every dogs data to new array
        for (var i = 0; i < markers.length; i++) {
            for (var j = 0; j < dogList.length; j++) {
                if (markers[i].no === dogList[j].no) {
                    distMarkerList[j].push(markers[i])
                    latlngs[j].push(
                        [markers[i].lat, markers[i].lng]
                    );
                }
            }
        }

        
        // console.log('dogList', dogList)
        // console.log('distMarker', distMarkerList)

        // Send dogList, latlngs, and distMarkerList to frontend
        io.emit('serialdata', { dogs: dogList, position: latlngs, markers: distMarkerList })
    })
    res.json(stream)
})
// file.end();
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "client/public", "index.html"));
//    });