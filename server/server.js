const express = require('express'), 
    app = express(),
    SerialPort = require ('serialport'),
    port = new SerialPort('/dev/ttyUSB0', {
        baudRate: 115200,
    }, err => {
        if(err!= null){
            console.log(err)
            return
        }
    })

const body = [];

var stream
app.get('/data', (req,res) => {
    port.setMaxListeners(9000)
    port.on('data', data => {

        data= JSON.stringify(data)
        data = JSON.parse(data)
        stream = 
        String.fromCharCode.apply(String,data.data).replace(`/\0\r\n/g`,'');
        console.log(stream)
        body.push(stream)
    })
    res.json(stream)
})
app.get('/', (req, res) => res.send('Hello World!'))

const path = require("path");
const ports = 5000
// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "client/public", "index.html"));
//    });


app.listen(ports, () => console.log(`Listening on port ${ports}!`))