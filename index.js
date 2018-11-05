var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var playernames = [];

app.use('/view', express.static(__dirname + '/view'));
app.use('/model', express.static(__dirname + '/model'));
app.use('/controller', express.static(__dirname + '/controller'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/socket', express.static(__dirname + '/socket'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('player name', function (data, callback) {
    if (playernames.length >= 2) {
      callback(false);
    } else {
      callback(true);
      socket.playername = data;
      playernames.push(socket.playername);
      io.sockets.emit("playernames", playernames);
    }
  });

  socket.on('pressed', function(key) {
    if (key === 37) {
      
    }
    if (key === 38) {

    }
  });

  socket.on('disconnect', function (data) {
    if (!socket.playername) return;
    playernames.splice(playernames.indexOf(socket.playername), 1);
    io.sockets.emit("playernames", playernames);
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});
