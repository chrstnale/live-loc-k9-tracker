const express = require('express')
const app = express()
// const port = 3000
app.use(express.static(__dirname))
app.get('/', (req, res) => res.send('Hello World!'))

// const express = require('express'),
      // app = express(),
      SerialPort = require('serialport'),
      port = new SerialPort('/dev/ttyUSB0', {
    baudRate: 9600,
}, err => {
    if(err != null) {
        console.log(err)
        return
    }
})

app.listen(5000, () => console.log(`Listening on port 5000!`))


// // const express = require('express')
// // const app = express()
// // const port = 3000
// // app.get('/', (req, res) => res.send('Hello World!'))

// const express = require('express'),
//       app = express(),
//       SerialPort = require('serialport'),
//       port = new SerialPort('/dev/ttyUSB0', {
//     baudRate: 9600,
// }, err => {
//     if(err != null) {
//         console.log(err)
//         return
//     }
// })
// var stream
// app.get('/data', (req,res) => {
//     port.setMaxListeners(9000)
//     port.on('data', data => {
//       data = JSON.stringify(data)
//       data = JSON.parse(data)
//       stream = data      
//     })
//     res.json(stream)
// })

// app.listen(3000, () => console.log(`Listening on port 3000!`))

// // const express = require('express'),
// //       app = express(),
// //       SerialPort = require('serialport'),
// //       port = new SerialPort('/dev/ttyUSB0', {
// //     baudRate: 9600,
// // }, err => {
// //     if(err != null) {
// //         console.log(err)
// //         return
// //     }
// // })

// // // const express = require('express'); //Line 1
// // // const app = express(); //Line 2
// // // const port = process.env.PORT || 5000; //Line 3

// // // This displays message that the server running and listening to specified port
// // // app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// // // create a GET route
// // // app.get('/express_backend', (req, res) => { //Line 9
// // //   res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
// // // }); //Line 11
// // const express = require('express'),
// //       app = express(),
// //       SerialPort = require('serialport'),
// //       port = new SerialPort('/dev/ttyUSB0', {
// //     baudRate: 9600,
// // }, err => {
// //     if(err != null) {
// //         console.log(err)
// //         return
// //     }
// // })
// // app.use(express.static(__dirname))
// // var stream
// // app.get('/data', (req,res) => {
// //   port.setMaxListeners(9600)
// //   port.on('data', data => {
// //       data = JSON.stringify(data)
// //       data = JSON.parse(data)
// //       stream = String.fromCharCode.apply(String, data.data).replace(/\0\r\n/g,'');
// //       stream = stream.split("?")
// //       console.log(data)
// //     })
// //     res.json(stream)
// // })

// // app.listen(5000, () => console.log("Listening to port 5000"))

