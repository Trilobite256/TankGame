var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('/view', express.static(__dirname + '/view'));
app.use('/model', express.static(__dirname + '/model'));
app.use('/controller', express.static(__dirname + '/controller'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/socket', express.static(__dirname + '/socket'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
//   socket.on('chat message', function (msg) {
//     io.emit('chat message', msg);
//   })
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
