var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var fs = require('fs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/test.html");
    //res.sendFile(__dirname + "/public/index.html");
});

app.get('/TestData', (req, res) =>{
    res.sendFile(__dirname + "/public/test.html");
});
app.get('/Download', (req, res) =>{
    
    res.sendFile(__dirname + "/models/message2.csv");
});

server.listen(PORT, function () {
    console.log('listening on *:' + PORT);
});

var io = require('socket.io')(server);

io.on('connect', function (socket) {

    console.log('a user connected');

    socket.on('message', function (data) {
        console.log(typeof data);
        console.log(data);
        io.emit('message', data);
    });
        
    socket.on('event_name', function (data) {
        console.log(data);
        io.emit('message', data);
    });
    socket.on('saveData', function (data){
        console.log(data);
        const obj = data;
        console.log(data);
        const csvData = `${Date()}, ${Date.now()}, ${obj.sData}, ${obj.output}, ${obj.SP}\n`
        fs.appendFile('src/models/message2.csv', csvData, function (err) {
            if (err) throw err;
            console.log(`Saved data ${csvData}`);
            //socket.emit('changeVal', csvData);
        })
        io.emit('updateWeb', data);
    });
    socket.on('encender', function(data){
        console.log('Encender motor');
        data="AMONGOS"
        io.emit('setEncendido',data);
    });
    socket.on('apagar', function(data){
        console.log('Apagar motor');
        io.emit('resetEncendido',data);
    });
    socket.on('cambioSP',function(data){
        console.log('changeSP');
        console.log(data);
        io.emit('changeSP', data);
        
        //io.emit('updateWeb',{sData: 45, output: 5, SP: 50}) //Test de gráfica
    });
    socket.on('cambioPID', function(data){
        console.log('CambioPID');
        console.log(data);
        io.emit('changePID', data);
    })
});

io.on("error", (err) =>{
  console.log("Caught flash policy server socket error: ");
  console.log(err.stack);
})